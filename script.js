/*
Note to the reviewer: The mock up shows data ranging from the years 2001 - 2025.
However there is only complete data for the years 2013 - 2017. In the mockup, this makes
the growth rate of the nations computer programmers to be roughly 2% slower than Regional
and state data. I thought that the only appropriate way to accurately display the
information would be to only display the years with the complete data.

If the data were to be complete for 2018, the following lines can be commented out
and the proper lines could be uncommented.

Comment: line 79            Uncomment: line 80
Comment: line 96            Uncomment: line 97
Comment: line 113, 114      Uncomment: line 111, 112
Comment: line 120, 121      Uncomment: line 118, 119
Comment: line 301           Uncomment: line 300
*/

//Defines the graph that is used to show the data
const GRAPH = document.getElementById('graph')

/*******************************
 Name: checkPos()
 variables: num, eId (elementId)
 Purpose: This function evaluates a numerical value and takes in the an elements id.
 If the numerical value is positive, a green class is added that should make the text
 color green. If the numerical value is false, a red class is added that should make
 the text color red.
********************************/
function checkPos(num, eId){
    if (num > 0) {
        eId.classList.add('green');
    } else {
        eId.classList.add('red');
    }
    return 0;
}

/*******************************
 Name: precisionRound()
 variables: number, precision
 Purpose: This function takes in number multiplies it by ten, and then divides
 that number by ten. This changes the precision of the number to have one decimal.
********************************/
function precisionRound(number) {
    var newNum = Math.round(number * 10) / 10
    return newNum
}

(function($, document){
    $( document ).ready( function() {
        $.getJSON("data.json", function(json) {

          //These arrays store all of the data that are used for calculations, and the graph
          var regional = [], state = [], national = [], years = [], gArray = [];
          storeCArray(regional, 'r', json.trend_comparison.regional.length);
          storeCArray(state, 's', json.trend_comparison.state.length);
          storeCArray(national, 'n', json.trend_comparison.nation.length);
          storeYArray(years, json.trend_comparison.start_year, json.trend_comparison.end_year);
          storeGArray(gArray);


          /* These are the first two lines below the h1 header. This would change the occupation
          and the location if the json file was changed but the format was kept the same */
          $('.pHead').html('Occupational Summary for ' + json.occupation.title)
          $('.occupationInfo').html(json.occupation.title + ' in ' + json.region.title)

          /* This section is a flexbox with three divs inside. The jQuery functions add
          the propper text along with the imported values from the json file */
          var num = json.summary.jobs.regional
          $('#jobsTotal').html(num.toLocaleString());
          $('#jobsYear').html('Jobs (' + json.summary.jobs.year + ')');
          $('#vsNA').html(Math.round((json.summary.jobs.regional/json.summary.jobs.national_avg*100)) + '% <span class="green">above</span> National average');

          //checks to see if the pChange value from the json file is positive
          var pChange = regional[regional.length - 2];
          var p = document.getElementById('percentage');
          $('#percentage').html('+' + precisionRound(pChange, 1) + '%');
          checkPos(pChange, p);
          $('#yChange').html('% Change (' + json.summary.jobs_growth.start_year + '-' + (json.summary.jobs_growth.end_year - 1) + ')');
          //$('#yChange').html('% Change (' + json.summary.jobs_growth.start_year + '-' + (json.summary.jobs_growth.end_year ) + ')');

          var natChange = json.summary.jobs_growth.national_avg;
          $('#nPercentage').html('Nation: <span id="pColor"></span>');

          var n = document.getElementById('pColor');
          $('#pColor').html("+" + natChange);
          //checks to see if the natChange value from the json file is positive
          checkPos(natChange, n);

          $('#rate').html('$' + json.summary.earnings.regional + '/hr');
          $('#nRate').html('Nation: $' + json.summary.earnings.national_avg + '/hr');

          //This next section fills the first table with the correct json data
          //Table Headers
          $('#startYear').html(json.trend_comparison.start_year + ' Jobs');
          $('#endYear').html((json.trend_comparison.end_year - 1) + ' Jobs')
          // $('#endYear').html((json.trend_comparison.end_year) + ' Jobs')

          /*these are for the convenience of writing and reading the code.
          they are used in the four columns of the industry table*/
          var r = json.trend_comparison.regional;
          var s = json.trend_comparison.state;
          var n = json.trend_comparison.nation;

          //Column One
          $('#rJobsStart').html(r[0].toLocaleString());
          $('#sJobsStart').html(s[0].toLocaleString());
          $('#nJobsStart').html(n[0].toLocaleString());

          //Column Two
          // $('#rJobsEnd').html(r[r.length - 1].toLocaleString());
          // $('#sJobsEnd').html(s[s.length - 1].toLocaleString());
          $('#rJobsEnd').html(r[r.length - 2].toLocaleString());
          $('#sJobsEnd').html(s[s.length - 2].toLocaleString());
          $('#nJobsEnd').html(n[n.length - 1].toLocaleString());

          //Column Three
          // var changeR = r[r.length - 1] - r[0];
          // var changeS = s[s.length - 1] - s[0];
          var changeR = r[r.length - 2] - r[0];
          var changeS = s[s.length - 2] - s[0];
          var changeN = n[n.length - 1] - n[0];
          $('#rChange').html(changeR.toLocaleString());
          $('#sChange').html(changeS.toLocaleString());
          $('#nChange').html(changeN.toLocaleString());

          //Column Four
          $('#rpChange').html(precisionRound(changeR / r[0] * 100, 1) + '%');
          $('#spChange').html(precisionRound(changeS / s[0] * 100, 1) + '%');
          $('#npChange').html(precisionRound(changeN / n[0] * 100, 1) + '%');

          /*The following information makes up the info in the second table*/
          $('#industryStats').html('Industries Employing ' + json.occupation.title);

          //Column Headers
          $('#col2H').html('Occupation Jobs<br/>in Industry<br/>(' + json.summary.jobs.year +')');
          $('#col3H').html('% of Occupation<br>in industry<br>(' + json.summary.jobs.year + ')');
          $('#col4H').html('% of Total<br>Jobs in<br>Industry<br>(' + json.summary.jobs.year + ')');

          /*Column One, There are two lines for each. The HTML gives the content and the CSS
          gives the width of the blue bar behind it*/
          var jobs = json.employing_industries.industries;
          $('#jobTitle0').html(jobs[0].title);
          $('#jobTitle0').css("background", "linear-gradient(to right, #eef4ff 0%,#eef4ff " + gArray[0] + "%,#ffffff 0%,#ffffff 100%)");
          $('#jobTitle1').html(jobs[1].title);
          $('#jobTitle1').css("background", "linear-gradient(to right, #eef4ff 0%,#eef4ff " + gArray[1] + "%,#ffffff 0%,#ffffff 100%)");
          $('#jobTitle2').html(jobs[2].title);
          $('#jobTitle2').css("background", "linear-gradient(to right, #eef4ff 0%,#eef4ff " + gArray[2] + "%,#ffffff 0%,#ffffff 100%)");
          $('#jobTitle3').html(jobs[3].title);
          $('#jobTitle3').css("background", "linear-gradient(to right, #eef4ff 0%,#eef4ff " + gArray[3] + "%,#ffffff 0%,#ffffff 100%)");
          $('#jobTitle4').html(jobs[4].title);
          $('#jobTitle4').css("background", "linear-gradient(to right, #eef4ff 0%,#eef4ff " + gArray[4] + "%,#ffffff 0%,#ffffff 100%)");

          //Coulumn Two
          $('#iJobs0').html(jobs[0].in_occupation_jobs.toLocaleString());
          $('#iJobs1').html(jobs[1].in_occupation_jobs.toLocaleString());
          $('#iJobs2').html(jobs[2].in_occupation_jobs.toLocaleString());
          $('#iJobs3').html(jobs[3].in_occupation_jobs.toLocaleString());
          $('#iJobs4').html(jobs[4].in_occupation_jobs.toLocaleString());

          //Column Three
          var array = [];
          storeArray(array, 5);

          $('#pJobs0').html(precisionRound(array[0], 1) + '%');
          $('#pJobs1').html(precisionRound(array[1], 1) + '%');
          $('#pJobs2').html(precisionRound(array[2], 1) + '%');
          $('#pJobs3').html(precisionRound(array[3], 1) + '%');
          $('#pJobs4').html(precisionRound(array[4], 1) + '%');

          //Column Four
          var colFour = [];
          storePArray(colFour, 5);
          $('#pTJobs0').html(precisionRound(colFour[0], 1) + '%');
          $('#pTJobs1').html(precisionRound(colFour[1], 1) + '%');
          $('#pTJobs2').html(precisionRound(colFour[2], 1) + '%');
          $('#pTJobs3').html(precisionRound(colFour[3], 1) + '%');
          $('#pTJobs4').html(precisionRound(colFour[4], 1) + '%');


          //This is the declaration for creating the line graph
          let graph = new Chart(GRAPH, {
              type: 'line',
              data: {
                labels: years,
                datasets: [{
                      data: regional,
                      lineTension: 0,
                      fill: false,
                      borderColor: '#000f71',
                  },
                  {
                      data: state,
                      lineTension: 0,
                      fill: false,
                      borderColor: '#43a9d1',
                      pointStyle: 'rect',
                      pointRadius: 5
                  },
                  {
                      data: national,
                      lineTension: 0,
                      fill: false,
                      borderColor: '#c8edff',
                      pointStyle: 'triangle',
                      pointRadius: 5
                  }
                ],


              },
              options: {
                      legend: {
                          display: false
                      },
                      tooltips: {
                        enabled: false
                      },
                      hover: {
                        mode: null
                      },
                       title: {
                          text: 'Percentage Change',
                          position: 'left',
                          display: true
                       },
                       scales: {
                         yAxes: [{
                           gridLines: {
                             display: false
                           }
                         }],
                       }
              }

          })
          /*******************************
           Name: storeArray()
           variables: a (array), length
           Purpose: This function takes in an empty array and the desired length of the array.
           Then for each index of the array, it stores the percentage of jobs occupied in
           a part of the industry. This function is used to calculate column 3 of the industry table.
          ********************************/
          function storeArray(a, length) {
              var i;
              for (i = 0; i < length; i++) {
                  a[i] = jobs[i].in_occupation_jobs / json.employing_industries.jobs * 100;
              }
              return a;
          }

          /*******************************
           Name: storePArray() (Store Percentage Array)
           variables: a (array), length
           Purpose: This function takes in an empty array and the desired length of the array.
           Then for each index of the array, it stores the percentage of jobs occupied in
           the entire industry. This function is used to calculate column 4 of the industry table.
          ********************************/
          function storePArray(a, length) {
              var i;
              for (i = 0; i < length; i++) {
                  a[i] = jobs[i].in_occupation_jobs / jobs[i].jobs * 100;
              }
              return a;
          }

          /*******************************
           Name: storeCrray() (Store Comparison Array)
           variables: a (array), areaType, length
           Purpose: This function takes in an empty array, area type and the desired length of
           the array. First the function verifies which area type is declared either Regional,
           State, or National. Then the percentage change over time is calculated. The arrays
           are used in the graph for the data points.
          ********************************/
          function storeCArray(a, areaType, length) {
            var i;
            var regional = json.trend_comparison.regional;
            var state = json.trend_comparison.state;
            var national = json.trend_comparison.nation;
            for (i = length - 1; i >= 0; i--) {
                if (areaType === 'r') {
                    a[i] = (1 - (regional[i] / regional[0])) * -100;
                } else if (areaType === 's') {
                    a[i] = (1 - (state[i] / state[0])) * -100;
                } else if (areaType === 'n') {
                    a[i] = (1 - (national[i] / national[0])) * -100;
                }
            }
            return a;
          }

          /*******************************
           Name: storeYArray() (Store Year Array)
           variables: a (array), startYear, endYear
           Purpose: This function takes in an empty array, the start year, and the end year.
           Then the array is filled with each year.
          ********************************/
          function storeYArray(a, startYear, endYear) {
            var i = 0, year = startYear;
            //while(year <= endYear) {
            while(year < endYear) {
                a[i] = year;
                year++
                i++;
            }
            return a;
          }

          /*******************************
           Name: storeGArray() (Store Gradient Array)
           variables: a (array)
           Purpose: This function takes in an empty array.
           Then for each index of the array, it stores the percentage of the width of the
           gradient that fills the cell job title.
          ********************************/
          function storeGArray(a) {
            var i = 0;
            for (i = 0; i <= json.employing_industries.industries.length - 1; i++) {
              a[i] = json.employing_industries.industries[i].in_occupation_jobs / json.employing_industries.industries[0].in_occupation_jobs * 100
            }
            return a;
          }
        } );
    } );

} (jQuery, document));
