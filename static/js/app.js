function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metaurl = `/metadata/${sample}`;
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(metaurl).then(function(sample){
      var sampmeta = d3.select(`#sample-metadata`);
    // Use `.html("") to clear any existing metadata
      sampmeta.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(sample).forEach(function([key,value]){
        var row = sampmeta.append("p");
        row.text(`${key}:${value}`)
      })
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampurl = `/samples/${sample}`;
  d3.json(sampurl).then(function (response){
    // if (error) return console.log(error);
    var x_value = response["otu_ids"];
    var y_value = response["sample_values"];
    var size_value = response["sample_values"];
    var label = response["otu_labels"];
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: x_value,
      y: y_value,
      mode:"markers", 
      marker:{
        size: size_value,
        color: x_value,
        colorscale: "Rainbow",
        labels: label,
        type: 'scatter',
        opacity: 0.3
      }
    };

    var data1 = [trace1];

    var layout = {
      title: 'Marker Size',
      xaxis: { title: 'Operational Taxonomic Unit (OTU) ID' },
      showlegend: true
    };
    Plotly.newPlot("bubble", data1, layout); 

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(sampurl).then(function(data) {
      var pieVal = data.sample_values.slice(0,10);
      var pielab = data.otu_ids.slice(0, 10);
      var pieHov = data.otu_labels.slice(0, 10);

      var data = [{
        values: pieVal,
        labels: pielab,
        hovertext: pieHov,
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);
    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampnames) => {
    sampnames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstsamp = sampnames[0];
    buildCharts(firstsamp);
    buildMetadata(firstsamp);
  });
};

function optionChanged(newsamp) {
  // Fetch new data each time a new sample is selected
  buildCharts(newsamp);
  buildMetadata(newsamp);
};

// Initialize the dashboard
init();