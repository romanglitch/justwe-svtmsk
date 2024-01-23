$(function() {
    'use strict';

    /* Global object to store/access data */
    window.GL_APP = {}

    /* Variables */
    GL_APP.variables = {
        preloader: {
            animationDuration: 666,
            delay: 330,
        },
        fancyBox: {
            modalsOptions: {
                defaultType: 'inline',
                transitionDuration: 366,
                animationEffect: 'zoom-in-out',
                touch: false,
                autoFocus: false
            }
        }
    }

    /* Instances */
    GL_APP.instances = {
        swiper: {}
    }

    /* Elements */
    GL_APP.elements = {
        $html: $('html'),
        $body: $('body'),
        $app: $('.app'),
        $input: $('.main-form-input'),
        $select: $('.main-form-select'),
        $fancyboxModals: $('.js-modals'),
        $fancyboxGallery: $('[data-fancybox]'),
        maskInputs: {
            $phone: $('.js-phone-mask')
        },
        swiper: {
            heroCarousel: '.hero-carousel',
            spvCarousel: '.spv-carousel'
        }
    }

    /* Helpers */
    const helpers = {
        isInViewport: (el) => {
            const rect = el.getBoundingClientRect()

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)

            )
        }
    }

    /* Components */
    GL_APP.components = {
        // App components
        glPreloader: () => {
            GL_APP.elements.$html.css({
                '--preloader-anim-duration': GL_APP.variables.preloader.animationDuration,
                '--preloader-delay': GL_APP.variables.preloader.delay
            })

            GL_APP.elements.$html.addClass('--ready')
            setTimeout(() => {
                $('.preloader').fadeOut(GL_APP.variables.preloader.animationDuration, () => {
                    GL_APP.elements.$html.addClass('--loaded')
                })
            }, GL_APP.variables.preloader.delay)
        },
        glGetScrollbarWidth: () => {
            const outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.overflow = 'scroll';
            outer.style.msOverflowStyle = 'scrollbar';
            document.body.appendChild(outer);

            const inner = document.createElement('div');
            outer.appendChild(inner);

            const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

            outer.parentNode.removeChild(outer);

            GL_APP.elements.$html.css({
                '--sb-width': `${scrollbarWidth}px`,
            })

            return scrollbarWidth
        },
        glElevatorAnimations: () => {
            const $elevatorElement = $('.elevator')

            let stickyTop = $elevatorElement.offset().top
            let stickyCalc = stickyTop + Number($elevatorElement.css('--animation-start-px'))

            $(window).on('load scroll', function (e) {
                let windowTop = $(window).scrollTop();

                if (windowTop >= stickyTop) {
                    $elevatorElement.addClass('--sticky-bg')
                } else {
                    $elevatorElement.removeClass('--sticky-bg')
                }

                if (windowTop >= stickyCalc) {
                    $elevatorElement.addClass('--animation')
                } else {
                    $elevatorElement.removeClass('--animation')
                }
            })
        },

        // Vendor components
        glInitMasks: () => {
            GL_APP.elements.maskInputs.$phone.inputmask({
                mask: '+7 (*99) 999-99-99',
                definitions: {
                    // Number not start from 4,9
                    '*': {
                        validator: "[4,9]",
                    }
                }
            })
        },
        glInitLazyLoad: () => {
            GL_APP.instances.lazyLoadInstance = new LazyLoad({
                threshold: 0
            });
        },
        glInitSelect2: () => {
            GL_APP.elements.$select.select2({
                width: '100%',
                templateSelection: function (data, element) {
                    if (data.disabled) {
                        element.addClass('--placeholder')
                    } else {
                        element.removeClass('--placeholder')
                    }

                    return data.text;
                }
            })
        },
        glInitSwipers: () => {
            GL_APP.instances.swiper.heroCarousel = new Swiper(GL_APP.elements.swiper.heroCarousel , {
                direction: 'vertical',
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 1000,
                touchReleaseOnEdges: true,
                watchSlidesProgress: true,
                mousewheel: {
                    releaseOnEdges: true,
                },
                freeMode: {
                    sticky: true,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                on: {
                    init: function (swiper) {
                        // !TODO: refactoring block scroll functions
                        // const $asideElement = $('.app-aside')
                        //
                        // const preventScroll = (e) => {
                        //     e.preventDefault();
                        //     e.stopPropagation();
                        //
                        //     return false;
                        // }
                        //
                        // const toggleScrollOnAside = () => {
                        //     if (helpers.isInViewport(swiper.el)) {
                        //         $asideElement.on('wheel', preventScroll)
                        //     } else {
                        //         $asideElement.off('wheel', preventScroll)
                        //     }
                        //
                        //     return false
                        // }
                        //
                        // $(window).on('load scroll', toggleScrollOnAside)
                    },
                    progress: function (swiper, progress) {
                        GL_APP.elements.$html.css({
                            '--hero-carousel-progress': Math.round(progress * 100),
                            '--hero-carousel-speed': `${swiper.passedParams.speed}ms`
                        })
                    },
                    fromEdge: function (swiper) {
                        !helpers.isInViewport(swiper.el) ? $('html,body').animate({ scrollTop: 0 }, 300) : false
                    }
                },
            })

            GL_APP.instances.swiper.spvCarousel = new Swiper(GL_APP.elements.swiper.spvCarousel , {
                slidesPerView: 'auto',
                spaceBetween: 15,
                navigation: {
                    nextEl: '.swiper-button-next.spv-carousel-next',
                    prevEl: '.swiper-button-prev.spv-carousel-prev',
                },
            })
        },
        glInitFancyBox: () => {
            GL_APP.elements.$fancyboxModals.fancybox(GL_APP.variables.fancyBox.modalsOptions)

            GL_APP.elements.$fancyboxGallery.fancybox({
                transitionDuration: 366,
                animationEffect: 'zoom-in-out',
                backFocus: false,
                hash: false
            })
        }
    }

    /* Init app component [Preloader] */
    GL_APP.components.glPreloader()

    /* Init app component [Get scrollbar width] */
    GL_APP.components.glGetScrollbarWidth()

    /* Init app component [Elevator section animations] */
    GL_APP.components.glElevatorAnimations()

    /* Init component [LazyLoad] */
    GL_APP.components.glInitLazyLoad()

    /* Init component [Input masks] */
    GL_APP.components.glInitMasks()

    /* Init component [select2] */
    GL_APP.components.glInitSelect2()

    /* Init component [Swipers] */
    GL_APP.components.glInitSwipers()

    /* Init component [Fancybox] */
    GL_APP.components.glInitFancyBox()
});
