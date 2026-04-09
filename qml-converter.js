reearth.ui.show(`
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:sans-serif;font-size:13px;background:#1a1a1a;color:#e0e0e0;padding:12px}
h2{font-size:14px;font-weight:500;margin-bottom:12px;color:#fff}
.label{font-size:11px;color:#888;margin-bottom:6px}
.dz{border:1.5px dashed #444;border-radius:6px;padding:14px;text-align:center;background:#252525;display:flex;flex-direction:column;align-items:center;gap:6px}
.dz.over{background:#2d2d2d;border-color:#666}
.or-row{display:flex;align-items:center;gap:8px;margin:8px 0}
.or-line{flex:1;height:0.5px;background:#333}
.or-text{font-size:11px;color:#555}
textarea{width:100%;font-family:monospace;font-size:11px;resize:vertical;border:0.5px solid #333;border-radius:4px;padding:8px;background:#252525;color:#e0e0e0;min-height:70px}
.btn{display:inline-flex;align-items:center;padding:5px 12px;border:0.5px solid #444;border-radius:4px;background:transparent;color:#e0e0e0;font-size:12px;cursor:pointer}
.btn:hover{background:#333}
.btn-p{background:#1a3a5c;border-color:#2a5a8c;color:#7ac0f8}
.rh{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.rt{font-size:13px;font-weight:500}
.badge{font-size:10px;padding:2px 8px;border-radius:4px;background:#1a3a1a;color:#6abf6a}
.badge-w{background:#3a2a00;color:#c8a020}
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}
.pc{background:#252525;border-radius:4px;padding:8px}
.pk{font-size:10px;color:#666;margin-bottom:3px}
.pv{font-size:11px;font-weight:500;display:flex;align-items:center;gap:4px;word-break:break-all}
.sw{width:12px;height:12px;border-radius:2px;border:0.5px solid #444;flex-shrink:0}
.wb{background:#2a1f00;border:0.5px solid #5a4000;border-radius:4px;padding:8px;font-size:11px;color:#c8a020;margin-bottom:8px}
.cr{display:flex;height:14px;border-radius:4px;overflow:hidden;margin-bottom:8px;border:0.5px solid #333}
.cri{flex:1}
.hidden{display:none}
.ir{font-size:11px;color:#888;margin-bottom:8px;display:flex;gap:12px;flex-wrap:wrap}
.ii{display:flex;flex-direction:column;gap:1px}
.il{font-size:10px;color:#555}
.iv{font-weight:500;color:#bbb}
.tg input:checked + .tg input:checked + .sec{background:#1e1e1e;border:0.5px solid #2a2a2a;border-radius:6px;padding:12px;margin-bottom:10px}
</style>

<div class="sec">
  <h2>QML Reearth Style Converter</h2>
  <p class="label">QMLファイルを読み込む</p>
  <div class="dz" id="dz">
    <span style="font-size:12px;color:#aaa">.qml をドロップ</span>
    <label style="cursor:pointer">
      <input type="file" id="fi" accept=".qml" style="display:none">
      <span class="btn" style="font-size:11px;padding:4px 10px">ファイルを選択</span>
    </label>
  </div>
  <div class="or-row"><div class="or-line"></div><span class="or-text">または貼り付け</span><div class="or-line"></div></div>
  <textarea id="qi" placeholder="QMLの内容をここに貼り付け..."></textarea>
  <div style="display:flex;justify-content:flex-end;margin-top:8px">
    <button class="btn btn-p" id="cvt">変換する</button>
  </div>
</div>

<div class="sec hidden" id="rc" style="margin-top:16px">
  <div class="rh"><span class="rt">変換結果</span><span class="badge" id="tb"></span></div>
  <div id="wb" class="wb hidden"></div>
  <div class="ir" id="ir"></div>
  <div id="crw" class="hidden">
    <p class="label" style="margin-bottom:4px">カラーランプ</p>
    <div class="cr" id="cramp"></div>
  </div>
  <div class="pgrid" id="pg"></div>
  <p class="label">layer appearance JSON</p>
  <textarea id="oj" readonly style="min-height:120px;font-size:10px"></textarea>
  <div style="display:flex;justify-content:flex-end;margin-top:8px">
    <button class="btn" id="cpb">コピー</button>
  </div>
</div>

<script>
(function() {
  var dz = document.getElementById("dz");
  var fi = document.getElementById("fi");
  var qi = document.getElementById("qi");
  var cvt = document.getElementById("cvt");
  var rc = document.getElementById("rc");
  var tb = document.getElementById("tb");
  var wb = document.getElementById("wb");
  var pg = document.getElementById("pg");
  var oj = document.getElementById("oj");
  var cpb = document.getElementById("cpb");
  var ir = document.getElementById("ir");
  var crw = document.getElementById("crw");
  var cramp = document.getElementById("cramp");

  dz.addEventListener("dragover", function(e) { e.preventDefault(); dz.classList.add("over"); });
  dz.addEventListener("dragleave", function() { dz.classList.remove("over"); });
  dz.addEventListener("drop", function(e) {
    e.preventDefault(); dz.classList.remove("over");
    if (e.dataTransfer.files[0]) rf(e.dataTransfer.files[0]);
  });
  fi.addEventListener("change", function() { if (fi.files[0]) rf(fi.files[0]); });

  function rf(f) {
    var r = new FileReader();
    r.onload = function(e) { qi.value = e.target.result; };
    r.readAsText(f, "UTF-8");
  }

  function pqc(val) {
    if (!val) return null;
    var p = val.trim().split(",");
    if (p.length >= 4) {
      var r = parseInt(p[0]), g = parseInt(p[1]), b = parseInt(p[2]), a = parseInt(p[3]);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) return { r: r, g: g, b: b, a: a };
    }
    return null;
  }

  function toHex(c, am) {
    if (!c) return null;
    var a = Math.round(c.a * (am !== undefined ? am : 1));
    var h6 = "#" + [c.r, c.g, c.b].map(function(v) { return v.toString(16).padStart(2, "0"); }).join("");
    return a >= 255 ? h6 : h6 + a.toString(16).padStart(2, "0");
  }

  function getOM(el) {
    var m = {};
    if (!el) return m;
    el.querySelectorAll(":scope > Option").forEach(function(o) {
      var k = o.getAttribute("name"), v = o.getAttribute("value");
      if (k !== null && v !== null) m[k] = v;
    });
    return m;
  }

  function gsp(sym) {
    var p = {};
    if (!sym) return p;
    var st = sym.getAttribute("type") || "";
    var al = parseFloat(sym.getAttribute("alpha") || "1");
    sym.querySelectorAll("layer").forEach(function(l) {
      var cls = l.getAttribute("class") || "";
      var m = getOM(l.querySelector(":scope > Option[type='Map']"));
      if (cls === "SimpleFill" || st === "fill") {
        var fc = pqc(m["color"]);
        if (fc) {
          p.fillColor = toHex(fc, al);
          p.fillHex = "#" + [fc.r, fc.g, fc.b].map(function(v) { return v.toString(16).padStart(2, "0"); }).join("");
        }
        if (m["outline_style"] === "no") {
          p.strokeWidth = 0;
        } else {
          var oc = pqc(m["outline_color"]);
          if (oc) p.strokeColor = toHex(oc, 1);
          if (m["outline_width"]) p.strokeWidth = parseFloat(m["outline_width"]);
        }
      } else if (cls === "SimpleLine" || st === "line") {
        var lc = pqc(m["line_color"] || m["color"]);
        if (lc) p.strokeColor = toHex(lc, al);
        if (m["line_width"]) p.strokeWidth = parseFloat(m["line_width"]);
      } else if (cls === "SimpleMarker" || cls.indexOf("Marker") >= 0 || st === "marker") {
        var mc = pqc(m["color"]);
        if (mc) p.pointColor = toHex(mc, al);
        if (m["size"]) p.pointSize = parseFloat(m["size"]) * 4;
        var oc2 = pqc(m["outline_color"]);
        if (oc2) p.strokeColor = toHex(oc2, 1);
      }
    });
    return p;
  }

  function ggt(s) {
    var t = s ? (s.getAttribute("type") || "") : "";
    if (t === "fill") return "polygon";
    if (t === "line") return "line";
    if (t === "marker") return "point";
    return "polygon";
  }

  function gsm(r) {
    var m = {};
    r.querySelectorAll("symbols > symbol").forEach(function(s) { m[s.getAttribute("name")] = s; });
    return m;
  }

  function ba(p, gt) {
    var a = {};
    if (gt === "polygon") {
      a.polygon = {};
      if (p.fillColor) a.polygon.fillColor = p.fillColor;
      if (p.strokeColor || p.strokeWidth !== undefined) a.polygon.stroke = true;
      if (p.strokeColor) a.polygon.strokeColor = p.strokeColor;
      if (p.strokeWidth !== undefined) a.polygon.strokeWidth = p.strokeWidth;
    } else if (gt === "line") {
      a.polyline = {};
      if (p.strokeColor) a.polyline.strokeColor = p.strokeColor;
      if (p.strokeWidth !== undefined) a.polyline.strokeWidth = p.strokeWidth;
    } else {
      a.marker = {};
      if (p.pointColor) a.marker.pointColor = p.pointColor;
      if (p.pointSize !== undefined) a.marker.pointSize = p.pointSize;
      if (p.strokeColor) a.marker.strokeColor = p.strokeColor;
    }
    return a;
  }

  function bea(conds, gt, fp) {
    var ce = { expression: { conditions: conds } }, a = {};
    if (gt === "polygon") {
      a.polygon = { fillColor: ce };
      if (fp.strokeColor || fp.strokeWidth !== undefined) a.polygon.stroke = true;
      if (fp.strokeColor) a.polygon.strokeColor = fp.strokeColor;
      if (fp.strokeWidth !== undefined) a.polygon.strokeWidth = fp.strokeWidth;
    } else if (gt === "line") {
      a.polyline = { strokeColor: ce };
      if (fp.strokeWidth !== undefined) a.polyline.strokeWidth = fp.strokeWidth;
    } else {
      a.marker = { pointColor: ce };
      if (fp.pointSize !== undefined) a.marker.pointSize = fp.pointSize;
    }
    return a;
  }

  function conv(txt, simp) {
    var doc = new DOMParser().parseFromString(txt, "application/xml");
    var warn = [], meta = {}, result = {}, stype = "unknown";
    var rend = doc.querySelector("renderer-v2") || doc.querySelector("renderer");
    if (!rend) { warn.push("レンダラーが見つかりません"); return { result: result, stype: stype, warn: warn, meta: meta }; }
    var rt = rend.getAttribute("type") || "";
    meta.attr = rend.getAttribute("attr") || "";

    if (rt === "singleSymbol") {
      stype = "single";
      var sm = gsm(rend), sym = sm["0"] || Object.values(sm)[0];
      meta.geomType = ggt(sym); result = ba(gsp(sym), meta.geomType);

    } else if (rt === "categorizedSymbol") {
      stype = "categorized";
      var an = rend.getAttribute("attr") || "property", sm2 = gsm(rend), fs = Object.values(sm2)[0];
      meta.geomType = ggt(fs); meta.field = an; meta.colors = [];
      var conds = [];
      rend.querySelectorAll("categories > category").forEach(function(cat) {
        var v = cat.getAttribute("value"), sym2 = sm2[cat.getAttribute("symbol")];
        if (!sym2) return;
        var p = gsp(sym2), cv = p.fillColor || p.pointColor || "#888888";
        meta.colors.push(p.fillHex || "#888888");
        if (v === "") { conds.push(["true", "color('" + cv + "')"]); }
        else { conds.push(["\${" + an + "} === '" + v + "'", "color('" + cv + "')"]); }
      });
      if (!conds.filter(function(c) { return c[0] === "true"; }).length) conds.push(["true", "color('#c8c8c880')"]);
      result = bea(conds, meta.geomType, gsp(fs));

    } else if (rt === "graduatedSymbol") {
      stype = "graduated";
      var an2 = rend.getAttribute("attr") || "value", sm3 = gsm(rend), fs2 = Object.values(sm3)[0];
      meta.geomType = ggt(fs2); meta.field = an2; meta.colors = [];
      var rd = [];
      rend.querySelectorAll("ranges > range").forEach(function(range) {
        var lo = parseFloat(range.getAttribute("lower")), up = parseFloat(range.getAttribute("upper"));
        var sym3 = sm3[range.getAttribute("symbol")];
        if (!sym3) return;
        var p = gsp(sym3), cv = p.fillColor || p.pointColor || "#888888";
        meta.colors.push(p.fillHex || "#888888");
        rd.push({ lo: lo, up: up, cv: cv, p: p });
      });
      var conds2 = [];
      if (simp && rd.length > 0) {
        var sorted = rd.slice().sort(function(a, b) { return b.lo - a.lo; });
        sorted.forEach(function(r, i) {
          if (i === sorted.length - 1) { conds2.push(["true", "color('" + r.cv + "')"]); }
          else { conds2.push(["\${" + an2 + "} >= " + r.lo, "color('" + r.cv + "')"]); }
        });
      } else {
        rd.forEach(function(r) {
          conds2.push(["\${" + an2 + "} >= " + r.lo + " && \${" + an2 + "} < " + r.up, "color('" + r.cv + "')"]);
        });
        if (!conds2.filter(function(c) { return c[0] === "true"; }).length) conds2.push(["true", "color('#c8c8c880')"]);
      }
      result = bea(conds2, meta.geomType, gsp(fs2));

    } else if (rt === "RuleRenderer") {
      stype = "rule"; warn.push("ルールベースは未対応です。最初のシンボルのみ変換します。");
      var sm4 = gsm(rend), fs3 = Object.values(sm4)[0];
      meta.geomType = ggt(fs3); result = ba(gsp(fs3), meta.geomType);
    } else {
      warn.push("レンダラータイプ「" + rt + "」は未対応です。");
    }
    return { result: result, stype: stype, warn: warn, meta: meta };
  }

  cvt.addEventListener("click", function() {
    var qml = qi.value.trim();
    if (!qml) { alert("QMLを入力してください"); return; }
    try {
      var res = conv(qml, true);
      var result = res.result, stype = res.stype, warn = res.warn, meta = res.meta;
      rc.classList.remove("hidden");
      var tl = { single: "単一シンボル", categorized: "分類", graduated: "段階", rule: "ルールベース", unknown: "不明" };
      tb.textContent = tl[stype] || stype;
      tb.className = "badge" + (stype === "unknown" ? " badge-w" : "");
      wb.textContent = warn.join(" / ");
      wb.classList.toggle("hidden", warn.length === 0);
      ir.innerHTML = "";
      if (meta.field) ir.innerHTML += "<div class='ii'><span class='il'>フィールド</span><span class='iv'>" + meta.field + "</span></div>";
      if (meta.geomType) {
        var gl = { polygon: "ポリゴン", line: "ライン", point: "ポイント" };
        ir.innerHTML += "<div class='ii'><span class='il'>ジオメトリ</span><span class='iv'>" + (gl[meta.geomType] || meta.geomType) + "</span></div>";
      }
      var app = result.polygon || result.polyline || result.marker || {};
      var ex = (app.fillColor && app.fillColor.expression) ? app.fillColor.expression
              : (app.strokeColor && app.strokeColor.expression) ? app.strokeColor.expression
              : (app.pointColor && app.pointColor.expression) ? app.pointColor.expression : null;
      if (ex) {
        var tot = ex.conditions.length, def = ex.conditions.filter(function(c) { return c[0] === "true"; }).length;
        ir.innerHTML += "<div class='ii'><span class='il'>条件数</span><span class='iv'>" + (tot - def) + "件+デフォルト</span></div>";
      }
      if (meta.colors && meta.colors.length > 0) {
        crw.classList.remove("hidden");
        cramp.innerHTML = meta.colors.map(function(c) { return "<div class='cri' style='background:" + c + "'></div>"; }).join("");
      } else {
        crw.classList.add("hidden");
      }
      pg.innerHTML = "";
      Object.keys(app).forEach(function(k) {
        var v = app[k];
        if (typeof v === "string") {
          var d = document.createElement("div"); d.className = "pc";
          d.innerHTML = "<div class='pk'>" + k + "</div><div class='pv'><span class='sw' style='background:" + v + "'></span><span style='font-size:10px'>" + v + "</span></div>";
          pg.appendChild(d);
        } else if (typeof v === "number") {
          var d2 = document.createElement("div"); d2.className = "pc";
          d2.innerHTML = "<div class='pk'>" + k + "</div><div class='pv'>" + v + "</div>";
          pg.appendChild(d2);
        }
      });
      oj.value = JSON.stringify(result, null, 2);
    } catch(e) { alert("変換エラー: " + e.message); }
  });

  cpb.addEventListener("click", function() {
    navigator.clipboard.writeText(oj.value).then(function() {
      cpb.textContent = "コピーしました";
      setTimeout(function() { cpb.textContent = "コピー"; }, 1500);
    });
  });
})();
</script>
`);
