"use strict";
//      let mz_div = d3.select('#mz_sankey');
//      let mz_width = +mz_div.node().offsetWidth, mz_height = +mz_div.node().offsetHeight;
//      mz_div  .append('svg')   .attr('id', 'san_svg')   .attr('width', mz_width)   .attr('height', mz_height);



const _create_box1 = function (mz, download) {
    d3.selectAll("#mz_box1")
        .selectAll("svg")
        .remove();
    d3.selectAll("#mz_box1")
        .selectAll("div")
        .remove();

    d3.select("#mz_box1")
        .append("svg")
        .attr("id", "tl_svg");

    _render_timeline(mz);
    _render_download_button(download);

    window.addEventListener("resize", function () {
        d3.selectAll(".box1").selectAll("svg").remove();
        d3.selectAll(".box1").selectAll("div").remove();
        d3.select("#mz_box1").append("svg").attr("id", "tl_svg");
        _render_timeline(mz);
        _render_download_button(download);
    });
};



// load data
(async function () {
    // const rfm_timeline = await d3.csv("data/rfm_timeline.txt");

    d3.timeFormatDefaultLocale({
        "dateTime": "%A, der %e. %B %Y, %X",
        "date": "%A, der %e. %B %Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        "months": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
    });

    d3.formatDefaultLocale({
        decimal: ",",
        thousands: ".",
        grouping: [3],
        currency: ["", "€"]
    });

    // convert to time
    // convert item
    // convert color
    let parseTime = d3.timeParse("%Y-%m-%d");
    for (let i in timeline_data) {
        timeline_data[i].start = parseTime(timeline_data[i].start);
        timeline_data[i].start.setHours(9);
        timeline_data[i].end = parseTime(timeline_data[i].end);
        timeline_data[i].end.setHours(18);
        timeline_data[i].id = timeline_id[timeline_data[i].id];
        timeline_data[i].color = timeline_color[timeline_data[i].color];
    }

   

    let timeline_parameters = {
        data: timeline_data,
        div_id: "mz_box1",
        svg_id: "tl_svg",
        chart_id: 'tl5',
        left: 0.15,
        top: 0.1,
        right: 0.85,
        bottom: 0.8,
        left_min: 0,
        right_min: 0,
        class: "test",
        text: "TRUE",
        text_class: 'mz_normal_text_dark',
        axis_value: "noTRUE",
        padding_axis_value: 0.01,
        grid_value: "noTRUE",
        grid_label: "noTRUE",
        botbrush_top: 0.88,
        botbrush_bottom: 0.95,
        brush_interv: _timeline_brush_interv
    };

    let download_button_parameters = {
        id: "groupedbar_svg",
        div_id: "mz_box1",
        svg_id: "tl_svg",
        left: 0.05,
        top: 0.15,
        right: 0.15,
        bottom: 0.25,
        box_color: 'hsl(210, 17%, 98%)',
        hover_color: '#D3D3D3',
        text_selection_weight: "bold",
        selection: 'download',
        options: ['svg', 'png'],
        cb_parameters:{"svg_chart":timeline_parameters},
        cb_function: "_download(chartp.cb_parameters.svg_chart.chart_id, chartp.selection);"
    }


    _create_box1(timeline_parameters, download_button_parameters);
})();
