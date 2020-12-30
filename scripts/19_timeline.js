"use strict";

const _render_timeline = function (chartp) {

  let chart_svg = d3.select("#" + chartp.div_id);
  let chart_width = +chart_svg.node().offsetWidth,
    chart_height = +chart_svg.node().offsetHeight;
  chart_svg = d3
    .select("#" + chartp.svg_id)
    .attr("width", chart_width)
    .attr("height", chart_height)
    .append('svg')   // additional svg for saving
    .attr("width", chart_width)
    .attr("height", chart_height)
    //.attr("id", 'testme');
    .attr("id", chartp.chart_id);


  let chart_left = chartp.left * chart_width,
    chart_right = chartp.right * chart_width,
    chart_top = chartp.top * chart_height,
    chart_bottom = chartp.bottom * chart_height;

  // the min spaces left and right
  chart_right = Math.min(chart_right, chart_width - chartp.right_min);
  chart_left = Math.max(chart_left, chartp.left_min);

  let mz_width = chart_right - chart_left;
  let mz_height = (chartp.bottom - chartp.top) * chart_height;

  // item space in x-dir
  const x_marg = mz_width * 0.00;

  let mz_day_format = d3.timeFormat("%Y-%m-%d");
  // prepare data

  chart_svg.append("clipPath").attr("id", "chart-area2").append("rect").attr("x", chart_left).attr("y", chart_top).attr("width", mz_width).attr("height", mz_height);

  // Prepare Scale 

  // all values
  let dummy_ar = [];
  for (let i of chartp.data) {
    dummy_ar = dummy_ar.concat(i.end);
    dummy_ar = dummy_ar.concat(i.start);
  }

  let dummy_max = d3.max(dummy_ar);
  let dummy_min = d3.min(dummy_ar);

  let pad_value_x = chartp.padding_axis_value * (chart_right - chart_left);
  let pad_value_y = chartp.padding_axis_value * (chart_bottom - chart_top);

  let x_scale = d3.scaleTime().range([chart_left + pad_value_x, chart_right - pad_value_x]).domain(d3.extent(dummy_ar));
  let y_scale = d3.scaleBand().range([chart_bottom - pad_value_y, chart_top + pad_value_y]).domain(chartp.data.map(d => d.id)).padding(0.5);

  //  var y_scale2 = d3.scalePoint().range([height2, 0]).padding(0.5);

  // the Tooltip
  let tooltip = d3.select("body").append("div").attr("class", "toolTip");

  let mz_chart = chart_svg.append("g").attr("clip-path", "url(#chart-area2)").selectAll("mz_timel")
    .data(chartp.data)
    .enter();

  mz_chart.exit().remove();

  let mz_subchart = mz_chart.append("rect")
    .attr("class", "mz_timeline_rect")

    .attr("x", d => Math.min(x_scale(d.start), x_scale(d.end)) - x_marg)
    .attr("y", d => y_scale(d.id))
    .attr("width", d => Math.abs(x_scale(d.end) - x_scale(d.start)) + 2 * x_marg)
    .attr("height", d => y_scale.bandwidth())
    .attr('rx', 5).attr('ry', 5)
    .attr('stroke', 'grey')
    .attr("fill", d => d.color)



  if (chartp.text == 'TRUE') {
    mz_chart.append("text")
      .attr("class", "mz_timeline_text " + chartp.text_class)
      .attr("id", 'id1' + chartp.class)
      .attr("x", d => 0.5 * (x_scale(d.start) + x_scale(d.end)))
      .attr("y", d => y_scale(d.id) + 0.5 * y_scale.bandwidth())
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('fill', () => getComputedStyle(document.getElementById('id1' + chartp.class)).fill)
      .attr('font', () => getComputedStyle(document.getElementById('id1' + chartp.class)).font)
      .text(d => d.task);
  }


  mz_subchart.on("mousemove", function (d) {
      d3.select(this).attr("opacity", .75);
      tooltip.style("left", d => d3.event.pageX + 10 + "px");
      // tooltip.style("right",  d => 2*chart_right - mz_width - d3.event.pageX + "px");
      tooltip.style("top", d3.event.pageY - 25 + "px");
      tooltip.style("display", "inline-block");
      tooltip.html('Start: ' + mz_day_format(d.start) + "<br>" + 'End: ' + mz_day_format(d.end) + "<br>" + 'Task: ' + d.comment);
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("opacity", 1);
      tooltip.style("display", "none");
    });

  // Axes

  let ticksize_axis_left = 5;
  let ticksize_axis_bott = 5;

  chart_svg.append("g")
    .attr("class", "axis_chart")
    .attr("id", 'id2' + chartp.class)
    .attr("transform", "translate(" + chart_left + ",0)")
    .call(d3.axisLeft(y_scale).tickSize(ticksize_axis_left));

  d3.select('#id2' + chartp.class).selectAll("text")
    .attr("id", 'id3' + chartp.class)
    .attr('fill', () => getComputedStyle(document.getElementById('id3' + chartp.class)).fill)
    .attr('font-size', () => getComputedStyle(document.getElementById('id3' + chartp.class)).fontSize)

  d3.select('#id2' + chartp.class).selectAll("path")
    .attr("id", 'id4' + chartp.class)
    .attr('stroke', () => getComputedStyle(document.getElementById('id4' + chartp.class)).stroke)
    .attr('stroke-width', () => getComputedStyle(document.getElementById('id4' + chartp.class)).strokeWidth)

  d3.select('#id2' + chartp.class).selectAll("line")
    .attr("id", 'id5' + chartp.class)
    .attr('stroke', () => getComputedStyle(document.getElementById('id5' + chartp.class)).stroke)
    .attr('stroke-width', () => getComputedStyle(document.getElementById('id5' + chartp.class)).strokeWidth)


  chart_svg.append("g")
    .attr("class", "axis_chart3")
    .attr("id", 'id10' + chartp.class)
    .attr("transform", "translate(0," + chart_bottom + ")")
    .call(d3.axisBottom(x_scale).ticks(7));

  d3.select('#id10' + chartp.class).selectAll("text")
    .attr("id", 'id11' + chartp.class)
    .attr('fill', () => getComputedStyle(document.getElementById('id11' + chartp.class)).fill)
    .attr('font-size', () => getComputedStyle(document.getElementById('id11' + chartp.class)).fontSize)

  d3.select('#id10' + chartp.class).selectAll("path")
    .attr("id", 'id12' + chartp.class)
    .attr('stroke', () => getComputedStyle(document.getElementById('id12' + chartp.class)).stroke)
    .attr('stroke-width', () => getComputedStyle(document.getElementById('id12' + chartp.class)).strokeWidth)

  d3.select('#id10' + chartp.class).selectAll("line")
    .attr("id", 'id13' + chartp.class)
    .attr('stroke', () => getComputedStyle(document.getElementById('id13' + chartp.class)).stroke)
    .attr('stroke-width', () => getComputedStyle(document.getElementById('id13' + chartp.class)).strokeWidth)




  // show today
  const today = new(Date);
  chart_svg.append("g")
    .attr("class", "axis_chart2")
    .attr("id", 'id6' + chartp.class)
    .attr("transform", "translate(0," + chart_bottom + ")")
    .call(d3.axisTop(x_scale).tickValues([today]).tickSize(mz_height).ticks(1).tickFormat(d => 'Today'));

  d3.select('#id6' + chartp.class).selectAll("text")
    .attr("id", 'id7' + chartp.class)
    .attr('fill', () => getComputedStyle(document.getElementById('id7' + chartp.class)).fill)
    .attr('font-size', () => getComputedStyle(document.getElementById('id7' + chartp.class)).fontSize)

  d3.select('#id6' + chartp.class).selectAll("path")
    .attr("id", 'id8' + chartp.class)
    .attr('stroke', () => getComputedStyle(document.getElementById('id8' + chartp.class)).stroke)
    .attr('stroke-width', () => getComputedStyle(document.getElementById('id8' + chartp.class)).strokeWidth)

  d3.select('#id6' + chartp.class).selectAll("line")
    .attr("id", 'id9' + chartp.class)
    .attr('stroke', () => getComputedStyle(document.getElementById('id9' + chartp.class)).stroke)
    .attr('stroke-width', () => getComputedStyle(document.getElementById('id9' + chartp.class)).strokeWidth)


  // --------------------------------------------------------------------------------------------------
  // Brush

  function brushed() {
    let sel = d3.event.selection;
    if (sel != null) {
      // console.log(sel);
      chartp.brush_interv.value = sel.map(botbrush_x_scale.invert, botbrush_x_scale);
      x_scale.domain(chartp.brush_interv.value);
      chart_svg.selectAll(".mz_timeline_rect").attr("x", d => Math.min(x_scale(d.start), x_scale(d.end)) - x_marg).attr("width", d => Math.abs(x_scale(d.end) - x_scale(d.start)) + 2 * x_marg);
      chart_svg.selectAll(".mz_timeline_text").attr("x", d => 0.5 * (x_scale(d.start) + x_scale(d.end)));
      chart_svg.selectAll('#id10' + chartp.class).call(d3.axisBottom(x_scale).ticks(7));
      chart_svg.selectAll('#id6' + chartp.class).call(d3.axisTop(x_scale).tickValues([today]).tickSize(mz_height).ticks(1).tickFormat(d => 'Today'));
    }
  }

  let chart_botbrush_top = chartp.botbrush_top * chart_height,
    chart_botbrush_bottom = chartp.botbrush_bottom * chart_height;
  let botbrush_x_scale = d3.scaleTime().range([chart_left + pad_value_x, chart_right - pad_value_x]).domain(d3.extent(dummy_ar));
  let botbrush_y_scale = d3.scaleBand().range([chart_botbrush_bottom, chart_botbrush_top]).domain(chartp.data.map(d => d.id)).padding(0.5);

  let botbrush = d3.brushX().extent([
    [chart_left, chart_botbrush_top],
    [chart_right, chart_botbrush_bottom]
  ]).on("start brush end", brushed);

  if (chartp.brush_interv.value[0] == -1) {
    chartp.brush_interv.value = botbrush_x_scale.domain();
  }
  console.log(chartp.brush_interv.value);
  //  let mz_brush = chart_svg.append("g")  .attr("class", "botbrush")  .call(botbrush)  .call(botbrush.move, botbrush_x_scale.range());
  let mz_brush = chart_svg.append("g").attr("class", "botbrush").call(botbrush).call(botbrush.move, [x_scale(chartp.brush_interv.value[0]), x_scale(chartp.brush_interv.value[1])]);

  mz_chart = chart_svg.selectAll("mz_timel_brush")
    .data(chartp.data)
    .enter();

  mz_chart.exit().remove();

  mz_subchart = mz_chart.append("rect")
    .attr("class", chartp.class)

    .attr("x", d => Math.min(botbrush_x_scale(d.start), botbrush_x_scale(d.end)) - x_marg)
    .attr("y", d => botbrush_y_scale(d.id))
    .attr("width", d => Math.abs(botbrush_x_scale(d.end) - botbrush_x_scale(d.start)) + 2 * x_marg)
    .attr("height", d => botbrush_y_scale.bandwidth())
    .attr("fill", d => d.color);

  chart_svg.append("g")
    .attr("class", "axis_brush")
    .attr("id", 'id14' + chartp.class)
    .attr("transform", "translate(0," + chart_botbrush_bottom + ")")
    .call(d3.axisBottom(botbrush_x_scale).ticks(18).tickSize(ticksize_axis_bott));

  d3.select('#id14' + chartp.class).selectAll("text")
    .attr("id", 'id15' + chartp.class)
    .attr('fill', () => getComputedStyle(document.getElementById('id15' + chartp.class)).fill)
    .attr('font-size', () => getComputedStyle(document.getElementById('id15' + chartp.class)).fontSize)

  d3.select('#id14' + chartp.class).selectAll("path")
    .attr("id", 'id16' + chartp.class)
    .attr('stroke', () => getComputedStyle(document.getElementById('id16' + chartp.class)).stroke)
    .attr('stroke-width', () => getComputedStyle(document.getElementById('id16' + chartp.class)).strokeWidth)

  d3.select('#id17' + chartp.class).selectAll("line")
    .attr("id", 'id17' + chartp.class)
    .attr('stroke', () => getComputedStyle(document.getElementById('id17' + chartp.class)).stroke)
    .attr('stroke-width', () => getComputedStyle(document.getElementById('id17' + chartp.class)).strokeWidth)

 

}
