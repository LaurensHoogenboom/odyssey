!(function (t) {
    function e(n) {
        if (i[n]) return i[n].exports
        var a = (i[n] = { exports: {}, id: n, loaded: !1 })
        return t[n].call(a.exports, a, a.exports, e), (a.loaded = !0), a.exports
    }
    var i = {}
    return (e.m = t), (e.c = i), (e.p = ''), e(0)
})([
    function (t, e) {
        function i(t) {
            var e,
                i = {}
            for (e in t)
                'function' == typeof t[e]
                    ? (i[e] = t[e])
                    : 'object' == typeof t[e]
                    ? (i[e] = AFRAME.utils.clone(t[e]))
                    : (i[e] = t[e])
            return i
        }
        document.registerElement('a-timeline'),
            document.registerElement('a-timeline-group'),
            document.registerElement('a-timeline-animation'),
            AFRAME.registerComponent('animation-timeline', {
                schema: {
                    direction: { type: 'string', default: 'normal' },
                    loop: {
                        default: 0,
                        parse: function (t) {
                            return (
                                'true' === t ||
                                ('false' !== t && parseInt(t, 10))
                            )
                        },
                    },
                    pauseEvents: { type: 'array' },
                    startEvents: { type: 'array' },
                    timeline: { type: 'string' },
                },
                multiple: !0,
                init: function () {
                    var t,
                        e = this.data
                    for (
                        this.animationIsPlaying = !1,
                            this.beginAnimation =
                                this.beginAnimation.bind(this),
                            this.eventDetail = { name: this.id },
                            this.time = 0,
                            this.timeline = null,
                            t = 0;
                        t < e.startEvents.length;
                        t++
                    )
                        this.el.addEventListener(
                            e.startEvents[t],
                            this.beginAnimation
                        )
                    for (t = 0; t < e.pauseEvents.length; t++)
                        this.el.addEventListener(
                            e.pauseEvents[t],
                            this.pauseAnimation
                        )
                },
                play: function () {
                    this.data.startEvents.length || this.beginAnimation()
                },
                tick: function (t, e) {
                    this.animationIsPlaying &&
                        this.timeline &&
                        ((this.time += e), this.timeline.tick(this.time))
                },
                beginAnimation: function () {
                    var t,
                        e,
                        i,
                        n,
                        a,
                        o,
                        r,
                        s = this
                    if (
                        ((o = document.querySelector(this.data.timeline)),
                        'A-TIMELINE' !== o.tagName)
                    )
                        throw new Error(
                            '[animation-timeline] timeline must be a selector to <a-timeline> element.'
                        )
                    for (
                        this.animationIsPlaying = !0,
                            this.time = 0,
                            this.timeline = (
                                AFRAME.anime || AFRAME.ANIME
                            ).timeline({
                                autoplay: !1,
                                complete: function () {
                                    ;(s.animationIsPlaying = !1),
                                        s.el.emit(
                                            'animationtimelinecomplete',
                                            s.eventDetail
                                        )
                                },
                                direction: this.data.direction,
                                loop: this.data.loop,
                            }),
                            a = 0,
                            t = 0;
                        t < o.children.length;
                        t++
                    )
                        if ('A-TIMELINE-GROUP' !== o.children[t].tagName)
                            'A-TIMELINE-ANIMATION' === o.children[t].tagName &&
                                (a += this.addAnimationToTimeline(
                                    o.children[t],
                                    a
                                ))
                        else {
                            for (
                                r = o.children[t], n = 0, e = 0;
                                e < r.children.length;
                                e++
                            )
                                (i = this.addAnimationToTimeline(
                                    r.children[e],
                                    a
                                )),
                                    i > n && (n = i)
                            a += n
                        }
                },
                addAnimationToTimeline: function (t, e) {
                    var n, a, o, r, s, l, m
                    if (
                        ((a = 'animation__' + t.getAttribute('name')),
                        (m = t.getAttribute('select')),
                        (s = this.el.sceneEl.querySelectorAll(m)),
                        !s.length)
                    )
                        return (
                            console.warn(
                                '[animation-timeline] No entities found for select="' +
                                    m +
                                    '"'
                            ),
                            0
                        )
                    for (
                        n = parseFloat(t.getAttribute('offset') || 0, 10),
                            l = 0;
                        l < s.length;
                        l++
                    ) {
                        if (((o = s[l].components[a]), !o))
                            throw new Error(
                                'Could not find animation `' +
                                    a +
                                    '` for `' +
                                    t.getAttribute('select') +
                                    '`.'
                            )
                        o.updateConfig(),
                            o.stopRelatedAnimations(),
                            (r = i(o.config)),
                            (r.target = r.targets),
                            this.timeline.add(r, e + n)
                    }
                    return (r.duration || 0) + (r.delay || 0) + n
                },
                pauseAnimation: function () {
                    this.animationIsPlaying = !1
                },
            })
    },
])
