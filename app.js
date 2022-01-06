// fetch the json file
async function main() {
    const response = await fetch("samples.json");
    data = await response.json();
    // console.log(data);

    var dropdown = document.getElementById('selDataset');

    var names = data.names;
    for(var i = 0; i < names.length; i++) {
        var id_names = names[i];
        var id = document.createElement("option");
        id.textContent = id_names;
        id.value = id_names;
        dropdown.appendChild(id);

        // console.log("ID", id)
        // console.log("names", id_names)
    };

    dropdown.value = data.names[0];
    chartBuild(dropdown.value);
    metaBuild(dropdown.value);

};

function optionChanged(new_id) { 
    chartBuild(new_id);
    metaBuild(new_id);
};
        
/// BAR & BUBBLE CHART 
//using data.samples for the sample values, otu ids, and otu labels
async function chartBuild(new_id){

    let samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == new_id);
    var new_sample= resultArray[0]

    // bubble chart values
    var otu_labels = new_sample.otu_labels;
    var otu_ids = new_sample.otu_ids;
    var sample_values = new_sample.sample_values;   

        
    // slicing and sorting for bar chart
    var topten_values = sample_values.sort((a,b) => b - a).slice(0,10).reverse();
    var top_labels = otu_labels.slice(0,10);
    var top_ids = otu_ids.slice(0,10).map(thing => `OTU ${thing}`).reverse();

    // Create barchart
    var barchart = [{
        x: topten_values,
        y: top_ids,
        type: "bar",
        text: top_labels,
        orientation: "h",   
    }];
    // console.log("barchart data", barchart)

    let layout1 = { 
        title: "Top Ten Samples",    
    };

    // plot bar chart and layout
    Plotly.newPlot("bar", barchart, layout1, {responsive: true}); 
 
    
// Create bubblechart
    var bubble = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth",
        }
    }];

    // console.log("bubblechart data", bubble);

    let layout2 = {
        title: "Bacteria Per Sample",
        xaxis: {
            title: "OTU ID",
        },
    };

    // plot bubble chart and layout
    Plotly.newPlot("bubble", bubble, layout2, {responsive: true});

 };


/// DEMOGRAPHIC PANEL
async function metaBuild(new_id){
    
    var panel = document.getElementById('sample-metadata');
    let metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == new_id);
    var demo_id= resultArray[0]   

    // clear the data of exsisting
    panel.innerHTML = "";

    // display using h6 tag 
    for(const [key, value] of Object.entries(demo_id)) {
         var h6 =  document.createElement("h6");
        panel.append(h6,`${key.toUpperCase()}: ${value}`);
    };
};  

let data = {}
main();