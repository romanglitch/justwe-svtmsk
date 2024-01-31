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
            },
            galleryOptions : {
                transitionDuration: 366,
                animationEffect: 'zoom-in-out',
                backFocus: false,
                hash: false
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
            $phone: $('.js-phone-mask'),
            $number: $('.js-number-mask')
        },
        swiper: {
            heroCarousel: '.hero-carousel',
            spvCarousel: '.spv-carousel',
            offersCarousel: '.offers-carousel'
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
        },
        scrollToggleInit: () => {
            let keys = {37: 1, 38: 1, 39: 1, 40: 1};

            function preventDefault(e) {
                e.preventDefault();
            }

            function preventDefaultForScrollKeys(e) {
                if (keys[e.keyCode]) {
                    preventDefault(e);
                    return false;
                }
            }

            let supportsPassive = false;
            try {
                window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
                    get: function () { supportsPassive = true; }
                }));
            } catch(e) {}

            let wheelOpt = supportsPassive ? { passive: false } : false;
            let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

            helpers.scrollToggleDisable = function () {
                window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
                window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
                window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
                window.addEventListener('keydown', preventDefaultForScrollKeys, false);
            }

            helpers.scrollToggleEnable = function () {
                window.removeEventListener('DOMMouseScroll', preventDefault, false);
                window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
                window.removeEventListener('touchmove', preventDefault, wheelOpt);
                window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
            }
        }
    }

    /* Helpers init */
    helpers.scrollToggleInit()

    /* Components */
    GL_APP.components = {
        // App components
        glPreloader: () => {
            GL_APP.elements.$html.css({
                '--preloader-anim-duration': GL_APP.variables.preloader.animationDuration,
                '--preloader-delay': GL_APP.variables.preloader.delay
            })

            GL_APP.elements.$html.addClass('--ready')
            helpers.scrollToggleDisable()
            setTimeout(() => {
                $('.preloader').fadeOut(GL_APP.variables.preloader.animationDuration, () => {
                    GL_APP.elements.$html.addClass('--loaded')
                    helpers.scrollToggleEnable()
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

            if ($elevatorElement.length) {
                let stickyTop = $elevatorElement.offset().top
                let stickyCalc = stickyTop + Number($elevatorElement.css('--animation-start-px'))

                $(window).on('load scroll resize', function (e) {
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
            }
        },
        glInputCounter: () => {
            let elements = {
                $counterRoot: $('.input-counter'),
                $counterInput: $('.input-counter__input'),
                buttons: {
                    $increment: $('.input-counter__inc'),
                    $decrement: $('.input-counter__dec')
                }
            }

            let setCountForButton = ($inputElement) => {
                $inputElement.closest('.card__inner').find('.btn-cart__active span').text($inputElement.val())
            }

            elements.$counterInput.each(function () {
                setCountForButton($(this))
            })

            elements.$counterInput.on('change', function () {
                setCountForButton($(this))
            })

            elements.buttons.$decrement.on('click', function () {
                let $input = $(this).parent().find('input');
                let count = parseInt($input.val()) - 1;
                count = count < 1 ? 1 : count;
                $input.val(count);
                $input.trigger('change')
                setCountForButton($input)
                return false;
            })

            elements.buttons.$increment.on('click', function () {
                let $input = $(this).parent().find('input');
                $input.val(parseInt($input.val()) + 1);
                setCountForButton($input)
                $input.trigger('change')
                return false;
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

            GL_APP.elements.maskInputs.$number.inputmask({
                alias: 'numeric',
                allowMinus: false,
                min: 1,
                max: 999999,
                rightAlign: false,
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
                spaceBetween: 0,
                speed: 1000,
                watchSlidesProgress: true,
                mousewheel: {
                    releaseOnEdges: true,
                },
                touchReleaseOnEdges: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                on: {
                    progress: function (swiper, progress) {
                        GL_APP.elements.$html.css({
                            '--hero-carousel-progress': Math.round(progress * 100),
                            '--hero-carousel-speed': `${swiper.passedParams.speed}ms`
                        })
                    },
                    fromEdge: function (swiper) {
                        !helpers.isInViewport(swiper.el) ? $('html,body').animate({ scrollTop: 0 }, 300) : false
                    },
                    slideChangeTransitionStart: function () {
                        helpers.scrollToggleDisable()
                    },
                    slideChangeTransitionEnd: function () {
                        helpers.scrollToggleEnable()
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

            GL_APP.instances.swiper.offersCarousel = new Swiper(GL_APP.elements.swiper.offersCarousel , {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            })
        },
        glInitFancyBox: () => {
            GL_APP.elements.$fancyboxModals.fancybox(GL_APP.variables.fancyBox.modalsOptions)
            GL_APP.elements.$fancyboxGallery.fancybox(GL_APP.variables.fancyBox.galleryOptions)
        }
    }

    /* Init app component [Preloader] */
    GL_APP.components.glPreloader()

    /* Init app component [Get scrollbar width] */
    GL_APP.components.glGetScrollbarWidth()

    /* Init app component [Elevator section animations] */
    GL_APP.components.glElevatorAnimations()

    /* Init app component [Input counter | Increment & Decrement buttons] */
    GL_APP.components.glInputCounter()

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
