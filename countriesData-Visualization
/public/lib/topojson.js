topojson = function() {
    function t(t, e) {
        function n(e) {
            var n = t.arcs[e],
                r = n[0],
                o = [0, 0];
            return n.forEach(function(t) { o[0] += t[0], o[1] += t[1] }), [r, o]
        }
        var r = {},
            o = {},
            a = {};
        e.forEach(function(t) {
            var e = n(t);
            (r[e[0]] || (r[e[0]] = [])).push(t), (r[e[1]] || (r[e[1]] = [])).push(~t)
        }), e.forEach(function(t) {
            var e, r, i = n(t),
                c = i[0],
                s = i[1];
            if (e = a[c])
                if (delete a[e.end], e.push(t), e.end = s, r = o[s]) {
                    delete o[r.start];
                    var u = r === e ? e : e.concat(r);
                    o[u.start = e.start] = a[u.end = r.end] = u
                } else if (r = a[s]) {
                delete o[r.start], delete a[r.end];
                var u = e.concat(r.map(function(t) { return ~t }).reverse());
                o[u.start = e.start] = a[u.end = r.start] = u
            } else o[e.start] = a[e.end] = e;
            else if (e = o[s])
                if (delete o[e.start], e.unshift(t), e.start = c, r = a[c]) {
                    delete a[r.end];
                    var f = r === e ? e : r.concat(e);
                    o[f.start = r.start] = a[f.end = e.end] = f
                } else if (r = o[c]) {
                delete o[r.start], delete a[r.end];
                var f = r.map(function(t) { return ~t }).reverse().concat(e);
                o[f.start = r.end] = a[f.end = e.end] = f
            } else o[e.start] = a[e.end] = e;
            else if (e = o[c])
                if (delete o[e.start], e.unshift(~t), e.start = s, r = a[s]) {
                    delete a[r.end];
                    var f = r === e ? e : r.concat(e);
                    o[f.start = r.start] = a[f.end = e.end] = f
                } else if (r = o[s]) {
                delete o[r.start], delete a[r.end];
                var f = r.map(function(t) { return ~t }).reverse().concat(e);
                o[f.start = r.end] = a[f.end = e.end] = f
            } else o[e.start] = a[e.end] = e;
            else if (e = a[s])
                if (delete a[e.end], e.push(~t), e.end = c, r = a[c]) {
                    delete o[r.start];
                    var u = r === e ? e : e.concat(r);
                    o[u.start = e.start] = a[u.end = r.end] = u
                } else if (r = o[c]) {
                delete o[r.start], delete a[r.end];
                var u = e.concat(r.map(function(t) { return ~t }).reverse());
                o[u.start = e.start] = a[u.end = r.start] = u
            } else o[e.start] = a[e.end] = e;
            else e = [t], o[e.start = c] = a[e.end = s] = e
        });
        var i = [];
        for (var c in a) i.push(a[c]);
        return i
    }

    function e(e, r, o) {
        function a(t) { 0 > t && (t = ~t), (l[t] || (l[t] = [])).push(f) }

        function i(t) { t.forEach(a) }

        function c(t) { t.forEach(i) }

        function s(t) { "GeometryCollection" === t.type ? t.geometries.forEach(s) : t.type in d && (f = t, d[t.type](t.arcs)) }
        var u = [];
        if (arguments.length > 1) {
            var f, l = [],
                d = { LineString: i, MultiLineString: c, Polygon: c, MultiPolygon: function(t) { t.forEach(c) } };
            s(r), l.forEach(3 > arguments.length ? function(t, e) { u.push([e]) } : function(t, e) { o(t[0], t[t.length - 1]) && u.push([e]) })
        } else
            for (var p = 0, h = e.arcs.length; h > p; ++p) u.push([p]);
        return n(e, { type: "MultiLineString", arcs: t(e, u) })
    }

    function n(t, e) {
        function n(t, e) {
            e.length && e.pop();
            for (var n, o = h[0 > t ? ~t : t], a = 0, i = o.length, c = 0, s = 0; i > a; ++a) e.push([(c += (n = o[a])[0]) * f + d, (s += n[1]) * l + p]);
            0 > t && r(e, i)
        }

        function o(t) { return [t[0] * f + d, t[1] * l + p] }

        function a(t) { for (var e = [], r = 0, o = t.length; o > r; ++r) n(t[r], e); return 2 > e.length && e.push(e[0]), e }

        function i(t) { for (var e = a(t); 4 > e.length;) e.push(e[0]); return e }

        function c(t) { return t.map(i) }

        function s(t) {
            var e = t.type,
                n = "GeometryCollection" === e ? { type: e, geometries: t.geometries.map(s) } : e in v ? { type: e, coordinates: v[e](t) } : { type: null };
            return "id" in t && (n.id = t.id), "properties" in t && (n.properties = t.properties), n
        }
        var u = t.transform,
            f = u.scale[0],
            l = u.scale[1],
            d = u.translate[0],
            p = u.translate[1],
            h = t.arcs,
            v = { Point: function(t) { return o(t.coordinates) }, MultiPoint: function(t) { return t.coordinates.map(o) }, LineString: function(t) { return a(t.arcs) }, MultiLineString: function(t) { return t.arcs.map(a) }, Polygon: function(t) { return c(t.arcs) }, MultiPolygon: function(t) { return t.arcs.map(c) } };
        return s(e)
    }

    function r(t, e) { for (var n, r = t.length, o = r - e; --r > o;) n = t[o], t[o++] = t[r], t[r] = n }

    function o(t, e) {
        for (var n = 0, r = t.length; r > n;) {
            var o = n + r >>> 1;
            e > t[o] ? n = o + 1 : r = o
        }
        return n
    }

    function a(t) {
        function e(t, e) {
            t.forEach(function(t) {
                0 > t && (t = ~t);
                var n = a[t] || (a[t] = []);
                n[e] || (n.forEach(function(t) {
                    var n, r;
                    r = o(n = i[e], t), n[r] !== t && n.splice(r, 0, t), r = o(n = i[t], e), n[r] !== e && n.splice(r, 0, e)
                }), n[e] = e)
            })
        }

        function n(t, n) { t.forEach(function(t) { e(t, n) }) }

        function r(t, e) { "GeometryCollection" === t.type ? t.geometries.forEach(function(t) { r(t, e) }) : t.type in c && c[t.type](t.arcs, e) }
        var a = [],
            i = t.map(function() { return [] }),
            c = { LineString: e, MultiLineString: n, Polygon: n, MultiPolygon: function(t, e) { t.forEach(function(t) { n(t, e) }) } };
        return t.forEach(r), i
    }
    return { version: "0.0.32", mesh: e, object: n, neighbors: a }
}();