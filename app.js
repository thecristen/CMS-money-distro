var geos = {
  "New England": ["Connecticut","Maine","Massachusetts","New Hampshire","Rhode Island","Vermont"],
  "Mideast": ["Delaware","District of Columbia","Maryland","New Jersey","New York","Pennsylvania"],
  "Great Lakes": ["Illinois","Indiana","Michigan","Ohio","Wisconsin"],
  "Plains": ["Iowa","Kansas","Minnesota","Missouri","Nebraska","North Dakota","South Dakota"],
  "Southeast": ["Alabama","Arkansas","Florida","Georgia","Kentucky","Louisiana","Mississippi","North Carolina","South Carolina","Tennessee","Virginia","West Virginia"],
  "Southwest": ["Arizona","New Mexico","Oklahoma","Texas"],
  "Rocky Mountains": ["Colorado","Idaho","Montana","Utah","Wyoming"],
  "Far West": ["Alaska","California","Hawaii","Nevada","Oregon","Washington"]
}

var CMSdata = (function(d3, geos){
  var files = [
    {
      path: "data/Table 1 Personal Health Care.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 2 Hospital.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 3 Physician and Clinics.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 4 Other Professionals.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 5 Dental.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 6 Home Health.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 7 Nursing.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 8 Drugs and Non-durables.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 9 Durables.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 10 Other Health.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 11 Personal Health Care.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 12 Hospital.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 13 Physician and Clinics.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 14 Other Professional.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 15 Dental.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 16 Home Health Care.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 17 Nursing.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 18 Drugs and Non-durables.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 19 Durables.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 20 Other Health.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 21 Population.csv",
      meta: { unit: "persons", quant: "thousands" }
    },
    {
      path: "data/Table 22 Medicare.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 23 Medicare Per Enrollee.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 24 Medicare Enrollment.csv",
      meta: { unit: "persons", quant: "thousands" }
    },
    {
      path: "data/Table 25 Medicaid.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 26 Medicaid Per Enrollee.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 27 Medicaid Enrollment.csv",
      meta: { unit: "persons", quant: "thousands" }
    },
    {
      path: "data/Table 28 Private Health.csv",
      meta: { unit: "dollars", quant: "millions" }
    },
    {
      path: "data/Table 29 Private Per Enrollee.csv",
      meta: { unit: "dollars/person", quant: "millions" }
    },
    {
      path: "data/Table 30 Private Enrollment.csv",
      meta: { unit: "persons", quant: "thousands" }
    }
  ];

  function tableNameToKey(tablePath) {
    var key = '';
    var str = tablePath.substring(11, tablePath.length-4);
    key = str.substring(str.indexOf(" ")+1, str.length);
    return key;
  };

  function parseRows(string, table) {
    return d3.csvParseRows(string, function(d, j) {
      var isGroup = d3.keys(geos).indexOf(rowData[0]) > -1;
      var isHeaderOrFooter = (j <= 2 || j > 61);
      if (isGroup || isHeaderOrFooter) { return null; }

      var row = {};
      row["dataset"] = tableNameToKey(table.path);
      row["meta"] = table.meta;
      row["geo"] = rowData[0];

      if (row["dataset"].indexOf("Private") > -1) {
        row["yearly"] = [null,null,null,null,null,null,null,null,null,null,+rowData[1],+rowData[2],+rowData[3],+rowData[4],+rowData[5],+rowData[6],+rowData[7],+rowData[8],+rowData[9],+rowData[10],+rowData[11],+rowData[12],+rowData[13],+rowData[14]];
      } else {
        row["yearly"] = [+rowData[1],+rowData[2],+rowData[3],+rowData[4],+rowData[5],+rowData[6],+rowData[7],+rowData[8],+rowData[9],+rowData[10],+rowData[11],+rowData[12],+rowData[13],+rowData[14],+rowData[15],+rowData[16],+rowData[17],+rowData[18],+rowData[19],+rowData[20],+rowData[21],+rowData[22],+rowData[23],+rowData[24]];
      }

      return row;
    });
  }

  var q = d3.queue();

  for (var i = 0; i < files.length; ++i) {
    q.defer(d3.text, files[i].path);
  }

  q.awaitAll(function(error, results) {
    if (error) throw error;
    var result = results.map(function(tableData, j) {
      var tableDataset = tableNameToKey(files[j].path);
      var tableMeta = files[j].meta;

      return d3.csvParseRows(tableData, function(rowData, k) {
        var isGroup = d3.keys(geos).indexOf(rowData[0]) > -1;
        var isHeaderOrFooter = (k <= 2 || k > 61);
        if (isGroup || isHeaderOrFooter) { return null; }

        var row = {
          "dataset": tableDataset,
          "meta": tableMeta,
          "geo": rowData[0]
        };

        if (row["dataset"].indexOf("Private") > -1) {
          row["yearly"] = [null,null,null,null,null,null,null,null,null,null,+rowData[1],+rowData[2],+rowData[3],+rowData[4],+rowData[5],+rowData[6],+rowData[7],+rowData[8],+rowData[9],+rowData[10],+rowData[11],+rowData[12],+rowData[13],+rowData[14]];
        } else {
          row["yearly"] = [+rowData[1],+rowData[2],+rowData[3],+rowData[4],+rowData[5],+rowData[6],+rowData[7],+rowData[8],+rowData[9],+rowData[10],+rowData[11],+rowData[12],+rowData[13],+rowData[14],+rowData[15],+rowData[16],+rowData[17],+rowData[18],+rowData[19],+rowData[20],+rowData[21],+rowData[22],+rowData[23],+rowData[24]];
        }

        return row;
      });
    });
    console.log(result);
  });

})(d3, geos);

// reorganize data by year and state.
// debugger;
// var groupedCMSdata = d3.nest()
//   .key(function(d) { return d.geo; })
//   .key(function(d) { return d.dataset; })
//   .entries(CMSdata);
//
// console.log(groupedCMSdata);
