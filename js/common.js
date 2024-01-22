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
            heroCarousel: '.hero-carousel'
        }
    }

    /* Components */
    GL_APP.components = {
        // App components
        glHTMLStyles: () => {
            GL_APP.elements.$html.css({
                '--preloader-anim-duration': GL_APP.variables.preloader.animationDuration,
                '--preloader-delay': GL_APP.variables.preloader.delay
            })
        },
        glPreloader: () => {
            GL_APP.elements.$html.addClass('--ready')
            setTimeout(() => {
                $('.preloader').fadeOut(GL_APP.variables.preloader.animationDuration, () => {
                    GL_APP.elements.$html.addClass('--loaded')
                })
            }, GL_APP.variables.preloader.delay)
        },
        glDisableScrollOnAside: () => {
            let $aside = $('.app-aside')

            let preventScroll = (e) => {
                e.preventDefault();
                e.stopPropagation();

                return false;
            }

            $aside.on('wheel', preventScroll)
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

            let stickyTop = $elevatorElement.offset().top + Number($elevatorElement.css('--animation-start-px'))

            $(window).on('scroll', function () {
                let windowTop = $(window).scrollTop();

                if (windowTop >= stickyTop) {
                    $elevatorElement.addClass('--animation')
                } else {
                    $elevatorElement.removeClass('--animation')
                }
            })
        },

        // Default components
        glAccordion: (selector, options) => {
            let defaults = {
                openOnlyOne: true,
                animationDuration: 200,
                contentsAttrName: 'data-accordion-content',
                buttonsAttrName: 'data-accordion-target',
                activeAccordionClass: 'js-gl-acc-active',
                activeButtonsClass: 'js-gl-acc-button-active',
                activeContentClass: 'js-gl-acc-content-active',
            }; options = $.extend( {}, defaults, options )

            let elements = {
                $accordionItems: $( selector ),
                $buttonItems: $( selector ).find('[' + options.buttonsAttrName + ']'),
                $contentItems: $( selector ).find('[' + options.contentsAttrName + ']')
            }

            elements.$contentItems.hide()

            elements.$buttonItems.on('click', function (e) {
                e.preventDefault()

                let $thisButton = $( this ),
                    $thisAccordion = $thisButton.closest( elements.$accordionItems ),
                    $thisContent = $thisAccordion.find( '[' + options.contentsAttrName + '="' + $thisButton.attr( options.buttonsAttrName ) + '"]' )

                if ( $thisContent.css('display') === 'none' ) {
                    if (options.openOnlyOne) {
                        elements.$contentItems.slideUp(options.animationDuration).removeClass(options.activeContentClass)
                        elements.$buttonItems.removeClass(options.activeButtonsClass)

                        $thisContent.slideDown(options.animationDuration).addClass(options.activeContentClass)
                        $thisButton.addClass(options.activeButtonsClass)
                    } else {
                        $thisContent.slideDown(options.animationDuration).addClass(options.activeContentClass)
                        $thisButton.addClass(options.activeButtonsClass)
                    }
                } else {
                    $thisContent.slideUp(options.animationDuration).removeClass(options.activeContentClass)
                    $thisButton.removeClass(options.activeButtonsClass)
                }

                let showingContentsLength = $thisAccordion.find('.' + options.activeContentClass).length;

                if ( showingContentsLength > 0 ) {
                    if (options.openOnlyOne) {
                        elements.$accordionItems.not($thisAccordion).removeClass(options.activeAccordionClass);
                    }
                    $thisAccordion.addClass(options.activeAccordionClass)
                } else {
                    $thisAccordion.removeClass(options.activeAccordionClass)
                }
            })
        },
        glTabs: (options) => {
            let defaultActiveTab;

            if($(options.tabNavSelector + '[data-active-tab]').index() > 0) {
                defaultActiveTab = $(options.tabNavSelector + '[data-active-tab]').index();
            } else {
                defaultActiveTab = 0;
            }
            let defaults = {
                tabNavSelector: null,
                tabContentSelector: null,
                defaultActiveTab: defaultActiveTab,
                activeTabClass: 'js-gl-tab-active',
                activeNavClass: 'js-gl-tab-link-active',
            }; options = $.extend( {}, defaults, options )

            let elements = {
                $navItems: $(options.tabNavSelector),
                $contentItems: $(options.tabContentSelector)
            }

            elements.$contentItems.hide()
            elements.$contentItems.eq(options.defaultActiveTab).show().addClass(options.activeTabClass)
            elements.$navItems.eq(options.defaultActiveTab).addClass(options.activeNavClass).attr('disabled', 'disabled')

            elements.$navItems.on('click', function (e) {
                e.preventDefault()

                let $thisButton = $( this ),
                    $thisIndex = elements.$navItems.index(this),
                    $thisContent = elements.$contentItems.eq($thisIndex);

                elements.$contentItems.hide().removeClass(options.activeTabClass)
                elements.$navItems.removeClass(options.activeNavClass).removeAttr('disabled')

                $thisContent.show().addClass(options.activeTabClass)
                $thisButton.addClass(options.activeNavClass).attr('disabled', 'disabled')
            })

            return false
        },
        glAttrChanger: (options) => {
            let defaults = {
                targetSelector: null,
                buttonSelector: null,
                targetTextSelector: null,
                targetAttrName: null,
                dataAttrName: 'data-attr-value',
                dataTextAttrName: 'data-attr-text',
                activeButtonClass: 'js-gl-attr-active'
            }; options = $.extend( {}, defaults, options )

            let elements = {
                $targetItem: $(options.targetSelector),
                $buttonItems: $(options.buttonSelector),
                $targetTextItems: $(options.targetTextSelector),
                $firstButtonItem: $(options.buttonSelector).first()
            }

            elements.$targetItem.attr(options.targetAttrName, elements.$firstButtonItem.attr(options.dataAttrName))
            elements.$firstButtonItem.addClass(options.activeButtonClass).attr('disabled', 'disabled')

            elements.$targetTextItems.html(elements.$firstButtonItem.attr(options.dataTextAttrName))

            elements.$buttonItems.on('click', function (e) {
                e.preventDefault()

                let $thisButton = $( this ),
                    thisData = $thisButton.attr(options.dataAttrName),
                    thisText = $thisButton.attr(options.dataTextAttrName)

                elements.$buttonItems.removeClass(options.activeButtonClass).removeAttr('disabled')
                elements.$targetItem.attr(options.targetAttrName, thisData)
                elements.$targetTextItems.html(thisText)
                $thisButton.addClass(options.activeButtonClass).attr('disabled', 'disabled')
            })

            return false
        },
        glToggleClass: (options) => {
            let defaults = {
                targetSelector: null,
                buttonSelector: null,
                toggleOnInit: false,
                detectOutsideClick: false,
                toggleFalseOnScroll: false,
                activeTargetClass: 'js-gl-toggle-target-active',
                activeButtonClass: 'js-gl-toggle-button-active',
                on: {
                    changeState: null
                }
            }; options = $.extend( {}, defaults, options )

            let elements = {
                $window: $(window),
                $targetElement: $(options.targetSelector),
                $button: $(options.buttonSelector),
            }

            let changeTargetState = (isToggle) => {
                if (!elements.$targetElement.hasClass(options.activeTargetClass)) {
                    elements.$targetElement.addClass(options.activeTargetClass)
                    elements.$button.addClass(options.activeButtonClass)

                    isToggle = true
                } else {
                    elements.$targetElement.removeClass(options.activeTargetClass)
                    elements.$button.removeClass(options.activeButtonClass)

                    isToggle = false
                }

                if (typeof options.on.changeState == 'function') {
                    options.on.changeState.call(this, elements, isToggle);
                }
            }

            if (options.toggleOnInit) {
                changeTargetState()
            }

            elements.$button.on('click', function (e) {
                e.stopPropagation()
                changeTargetState()
            })

            // DEPRECATED
            if (options.toggleFalseOnScroll) {
                let scrollTimeout = {
                    timeoutInstance: null,
                    timeoutTime: 100
                }

                let scrollOffset = 300

                let thisScrollPosition = $(window).scrollTop(),
                    ScrollPositionMax = thisScrollPosition + scrollOffset,
                    ScrollPositionMin = thisScrollPosition - scrollOffset

                $(window).on('scroll', function () {
                    if (!scrollTimeout.timeoutInstance) {
                        scrollTimeout.timeoutInstance = setTimeout(function () {

                            if ($(this).scrollTop() > ScrollPositionMax || $(this).scrollTop() < ScrollPositionMin) {
                                if (elements.$targetElement.hasClass(options.activeTargetClass)) {
                                    changeTargetState()
                                }
                            }

                            scrollTimeout.timeoutInstance = null;
                        }, scrollTimeout.timeoutTime);
                    }
                });
            }

            if (options.detectOutsideClick) {
                elements.$window.on('click', function (e) {
                    if (elements.$targetElement.hasClass(options.activeTargetClass) && !$(e.target).closest('.select2-dropdown').length) {
                        changeTargetState()
                    }
                })

                elements.$targetElement.on("click",function(e){
                    e.stopPropagation()
                })
            }

            return false
        },

        // Vendor components
        glInitMasks: () => {
            GL_APP.elements.maskInputs.$phone.inputmask({
                mask: '+7 (*99) 999-99-99',
                definitions: {
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

            GL_APP.elements.$select.on('select2:select', function (e) {
                $(e.currentTarget).removeClass('--error')
            });
        },
        glInitSwipers: () => {
            GL_APP.instances.swiper.heroCarousel = new Swiper(GL_APP.elements.swiper.heroCarousel , {
                direction: "vertical",
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
                    el: ".swiper-pagination",
                    clickable: true,
                },
                on: {
                    progress: function (swiper, progress) {
                        GL_APP.elements.$html.css({
                            '--hero-carousel-progress': progress * 100,
                            '--hero-carousel-speed': `${swiper.passedParams.speed}ms`
                        })
                    },
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

    /* Init app component [Export data to CSS] */
    GL_APP.components.glHTMLStyles()

    /* Init app component [Preloader] */
    GL_APP.components.glPreloader()

    /* Init app component [Disable scroll on Aside element] */
    GL_APP.components.glDisableScrollOnAside()

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
