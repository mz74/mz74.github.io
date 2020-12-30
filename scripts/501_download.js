"use strict";

const _download = function (svg_id, dl_option) {

  const serialize = function (svg) {
    const xmlns = "http://www.w3.org/2000/xmlns/";
    const xlinkns = "http://www.w3.org/1999/xlink";
    const svgns = "http://www.w3.org/2000/svg";
    svg = svg.cloneNode(true);
    const fragment = window.location.href + "#";
    //console.log(fragment);
    const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT, null, false);
    while (walker.nextNode()) {
      for (const attr of walker.currentNode.attributes) {
        //   console.log(attr);
        if (attr.value.includes(fragment)) {
          attr.value = attr.value.replace(fragment, "#");
          //        console.log(attr);
        }
        // let mz2 = getComputedStyle(walker.currentNode);
        // walker.currentNode.style.stroke=mz2.stroke;
        // console.log(walker.currentNode);
        // console.log(mz2);
        // console.log(attr);
        //attr.style = mz2;
      }
    }
    svg.setAttributeNS(xmlns, "xmlns", svgns);
    svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
    const serializer = new window.XMLSerializer;
    const string = serializer.serializeToString(svg);
    return new Blob([string], {
      type: "image/svg+xml"
    });
  };

  const rasterize = function (svg) {
    let resolve;
    let reject;
    const promise = new Promise((y, n) => (resolve = y, reject = n));
    const image = new Image();
    image.onerror = reject;
    image.onload = () => {
      const rect = svg.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      canvas.height = rect.height;
      canvas.width = rect.width;
      const context = canvas.getContext('2d');
      context.fillStyle = 'white';
      context.fillRect(0, 0, rect.width, rect.height);
      context.drawImage(image, 0, 0, rect.width, rect.height);
      context.canvas.toBlob(resolve);
    };
    image.src = URL.createObjectURL(serialize(svg));
    return promise;
  }

  // get svg
  const mz1 = document.getElementById(svg_id);

  // console.log(svg_id);
  // console.log(mz1);
  // console.log(dl_option);


  // save svg
  if (dl_option == 'svg') {
    let todownload = serialize(mz1);
    const a = document.createElement('a');
    a.download = 'chart.svg';
    a.href = URL.createObjectURL(todownload);
    //  a.click();
    a.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    // console.log(a);
  }

  // save png
  if (dl_option == 'png') {

    (async function () {
      let todownload = await rasterize(mz1);
      const a = document.createElement('a');
      a.download = 'chart.png';
      a.href = URL.createObjectURL(todownload);
      //a.click();
      a.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    })();
  }
}



const _render_download_button = function (chartp) {

  let chart_svg = d3.select("#" + chartp.div_id);
  let chart_width = +chart_svg.node().offsetWidth,
    chart_height = +chart_svg.node().offsetHeight;
  chart_svg = d3
    .select("#" + chartp.svg_id)
    .attr("width", chart_width)
    .attr("height", chart_height);

  let chart_left = chartp.left * chart_width,
    chart_right = chartp.right * chart_width,
    chart_top = chartp.top * chart_height,
    chart_bottom = chartp.bottom * chart_height;

  let mz_width = (chartp.right - chartp.left) * chart_width;
  let mz_height = (chartp.bottom - chartp.top) * chart_height;

  chart_svg = chart_svg.append("g").attr("class", "dropdown");
  let select = chart_svg.append("g").attr("class", "select");

  select.append("rect")
    .attr("class", "r" + chartp.chart_id)
    .attr("x", chart_left)
    .attr("y", chart_top)
    .attr("width", mz_width / 5)
    .attr("height", mz_height)
    .attr("fill", chartp.box_color)
    .attr("opacity", 1)
    .on("mousemove", d => d3.select(".r" + chartp.chart_id).attr("fill", chartp.hover_color))
    .on("mouseout", d => d3.select(".r" + chartp.chart_id).attr("fill", chartp.box_color));

  select.append("text")
    .text('\u22EE')
    .attr("class", "t" + chartp.chart_id)
    .attr("class", "normal_text")
    .attr('font-weight', chartp.text_selection_weight)
    //  .attr("id","mydropdown")
    .attr("x", chart_left)
    .attr("y", 0.5 * (chart_top + chart_bottom))
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'left')
    .style("cursor", "pointer")
    .attr('pointer-events', 'none')
    .style("user-select", "none");


  let options = chart_svg.selectAll(".my_options" + chartp.chart_id).data(chartp.options).enter().append("g");
  options.attr("class", "option")
    .on("click", d => {
      chartp.selection = d;
      // _render_rfm(chartp, rfm1, rfm2, rfm3, rfm4, d, 1000);
      eval(chartp.cb_function)
    });

  //     document.getElementById("mydropdown").innerHTML=this.getElementsByTagName("text")[0].innerHTML;
  //    d3.event.stopPropagation();

  options.append("rect")
    .attr("id", (d, i) => "r" + i + chartp.chart_id)
    .attr("x", chart_left)
    .attr("y", (d, i) => (chart_bottom + i * mz_height - i))
    .attr("width", mz_width)
    .attr("height", mz_height)
    .attr("fill", chartp.box_color)
    .attr("opacity", 0.95)
    .on("mousemove", (d, i) => (d3.select("#r" + i + chartp.chart_id).attr("fill", chartp.hover_color)))
    .on("mouseout", (d, i) => (d3.select("#r" + i + chartp.chart_id).attr("fill", chartp.box_color)));

  options.append("text")
    .text(d => 'Download ' + d)
    .attr("class", "normal_text")
    .attr("x", chart_left)
    .attr("y", (d, i) => (chart_bottom + (i + 0.5) * mz_height - i))
    .attr('dominant-baseline', 'middle')
    .attr('font-weight', chartp.text_selection_weight)
    .attr('text-anchor', 'left')
    .style("cursor", "pointer")
    .attr('pointer-events', 'none')
    .style("user-select", "none");



}