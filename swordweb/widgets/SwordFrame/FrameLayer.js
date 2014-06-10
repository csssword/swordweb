/**
  * 布局组件布局类
  * @class swordweb.widgets.SwordFrame.FrameLayer
 */
/**
  * 三块布局,上,左,右,中,下,供SwordFrame类layout属性进行调用
  * @property {public} frameLayer1
 */
var frameLayer1 = {
	oldOptions:{
		north:{
			styles:{
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': 1400,
				'height': 52,
                'zIndex':0
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "false",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
//		northDragDiv:{
//			styles:{
//				'position': 'absolute',
//				'left':0,
//				'top':52,
//				'width': 1400,
//				'height': 5
//			},
//			el: null
//		},
		west:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':57,
				'width': 300,
				'height': 645
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		westDragDiv:{
			styles:{
				'position': 'absolute',
				'left':300,
				'top':57,
				'width': 5,
				'height': 645
			},
			el: null							
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':305,
				'top':57,	
				'width': 890,
				'height': 645
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		eastDragDiv:{
			styles:{
				'position': 'absolute',
				'left':1195,
				'top':57,	
				'width': 5,
				'height': 645
			},
			el: null				
		},
		east:{
			styles:{
				'position': 'absolute',
				'left':1200,
				'top':57,	
				'width': 200,
				'height': 645
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		southDragDiv:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':702,	
				'width': 1400,
				'height': 5
			},
			el: null				
		},
		south:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':707,
				'width': 1400,
				'height': 150
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		}
	},
	newOptions:{
		north:{
			styles:{
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': 1400,
				'height': 52
			}
		},
//		northDragDiv:{
//			styles:{
//				'position': 'absolute',
//				'left':0,
//				'top':52,
//				'width': 1400,
//				'height': 5
//			}
//		},
		west:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':57,
				'width': 300,
				'height': 645
			}				
		},
		westDragDiv:{
			styles:{
				'position': 'absolute',
				'left':300,
				'top':57,
				'width': 5,
				'height': 645
			}							
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':305,
				'top':57,	
				'width': 890,
				'height': 645
			}
		},
		eastDragDiv:{
			styles:{
				'position': 'absolute',
				'left':1195,
				'top':57,	
				'width': 5,
				'height': 645
			}			
		},
		east:{
			styles:{
				'position': 'absolute',
				'left':1200,
				'top':57,	
				'width': 200,
				'height': 645
			}						
		},
		southDragDiv:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':702,	
				'width': 1400,
				'height': 5
			}				
		},
		south:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':707,
				'width': 1400,
				'height': 150
			}
		}
	}
};
/**
  * 三块布局,上,左,右,供SwordFrame类layout属性进行调用
  * @property {public} frameLayer2
 */
//三块布局,上,左,右
var frameLayer2 = {
	oldOptions:{
		north:{
			styles:{
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': 1400,
				'height': 62,
                'zIndex':0
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "false",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		west:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':68,
				'width': 300,
				'height': 785
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		westDragDiv:{
			styles:{
				'position': 'absolute',
				'left':300,
				'top':68,
				'width': 5,
				'height': 785
			},
			el: null
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':305,
				'top':68,
				'width': 1095,
				'height': 785
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		}
	},
	newOptions:{
		north:{
			styles:{
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': 1400,
				'height': 62
			}
		},
//		northDragDiv:{
//			styles:{
//				'position': 'absolute',
//				'left':0,
//				'top':62,
//				'width': 1400,
//				'height': 5
//			}				
//		},
		west:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':96,
				'width': 300,
				'height': 760
			}				
		},
		westDragDiv:{
			styles:{
				'position': 'absolute',
				'left':300,
				'top':96,
				'width': 5,
				'height': 760
			}							
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':305,
				'top':96,	
				'width': 1095,
				'height': 760
			}
		}
	}
};
/**
  * 两块布局,左,中,供SwordFrame类layout属性进行调用
  * @property {public} frameLayer3
 */
//两块布局,左,右
var frameLayer3 = {
	oldOptions:{
		west:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':1,
				'width': 300,
				'height': 852
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		westDragDiv:{
			styles:{
				'position': 'absolute',
				'left':300,
				'top':0,
				'width': 5,
				'height': 852
			},
			el: null							
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':305,
				'top':1,
				'width': 1092,
				'height': 852
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		}
	},
	newOptions:{
		west:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':0,
				'width': 300,
				'height': 857
			}				
		},
		westDragDiv:{
			styles:{
				'position': 'absolute',
				'left':300,
				'top':0,
				'width': 5,
				'height': 857
			}							
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':305,
				'top':0,
				'width': 1095,
				'height': 857
			}
		}
	}
};
/**
  * 三块布局,上,左,中,下,供SwordFrame类layout属性进行调用
  * 这个布局是组织结构的需求,最下面height很小
  * @property {public} frameLayer4
 */
//defaultDimensionOptions是完全5块布局的
var frameLayer4 = {
	oldOptions:{
		north:{
			styles:{
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': 1397,
				'height': 91,
                'zIndex':0
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "false",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		west:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':97,
				'width': 250,
				'height': 725
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		westDragDiv:{
			styles:{
				'position': 'absolute',
				'left':250,
				'top':97,
				'width': 5,
				'height': 725
			},
			el: null							
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':255,
				'top':97,
				'width': 1143,
				'height': 725
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		southDragDiv:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':822,
				'width': 1400,
				'height': 5
			},
			el: null
		},
		south:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':827,
				'width': 1397,
				'height': 30
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		}
	},
	newOptions:{
		north:{
			styles:{
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': 1400,
				'height': 92
			}
		},
		west:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':97,
				'width': 300,
				'height': 725
			}				
		},
		westDragDiv:{
			styles:{
				'position': 'absolute',
				'left':300,
				'top':97,
				'width': 5,
				'height': 725
			}							
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':305,
				'top':97,
				'width': 1095,
				'height': 725
			}
		},
//		southDragDiv:{
//			styles:{
//				'position': 'absolute',
//				'left':0,
//				'top':822,
//				'width': 1400,
//				'height': 5
//			}
//		},
		south:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':827,
				'width': 1400,
				'height': 30
			}
		}
	}
};
/**
  * 三块布局,上,中,右,下,供SwordFrame类layout属性进行调用
  * 这个布局是军工的需求,去掉左面的树,使用最上面的菜单进行导航,最下面的height要非常小,为了1024*768得分辨率
  * @property {public} frameLayer5
 */
var frameLayer5 = {
	oldOptions:{
		north:{
			styles:{
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': 1400,
				'height': 120,
                'zIndex':0
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "false",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':125,	
				'width': 1195,
				'height': 697
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		eastDragDiv:{
			styles:{
				'position': 'absolute',
				'left':1195,
				'top':125,	
				'width': 5,
				'height': 697
			},
			el: null				
		},
		east:{
			styles:{
				'position': 'absolute',
				'left':1200,
				'top':125,
				'width': 200,
				'height': 697
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		},
		southDragDiv:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':822,	
				'width': 1400,
				'height': 5
			},
			el: null	
		},
		south:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':827,
				'width': 1400,
				'height': 30
			},
			el: null,
			elSwordWidgetHash: new Hash(),
			scrollDiv: null,
			scrollDivBtn: null,
			scrollBtn: null,
			isScroll: "true",
            isFix:'false',
            fixLength:0,
			elTween: null,
			scrollDivTween: null,
			scrollRegionAboveFlag: false
		}
	},
	newOptions:{
		north:{
			styles:{
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': 1400,
				'height': 80
			}
		},
		center:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':85,	
				'width': 1195,
				'height': 697
			}
		},
		eastDragDiv:{
			styles:{
				'position': 'absolute',
				'left':1195,
				'top':85,	
				'width': 5,
				'height': 697
			}			
		},
		east:{
			styles:{
				'position': 'absolute',
				'left':1200,
				'top':85,	
				'width': 200,
				'height': 697
			}						
		},
		southDragDiv:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':822,	
				'width': 1400,
				'height': 5
			}				
		},
		south:{
			styles:{
				'position': 'absolute',
				'left':0,
				'top':827,
				'width': 1400,
				'height': 30
			}
		}
	}
};