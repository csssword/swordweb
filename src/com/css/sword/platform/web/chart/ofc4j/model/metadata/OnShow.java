package com.css.sword.platform.web.chart.ofc4j.model.metadata;
/**
 * 
 * @author dengjl@css.com.cn
 *
 */
public class OnShow {
        private String type;
        private Float cascade;
		private Float delay;
		
		public static final String TYPE_POP="pop";
		public static final String TYPE_GROW_UP="grow-up";
		public static final String TYPE_DROP="drop";
//   	 类型
//    	public enum onShow{
//    			POP{
//    				public String toString(){
//    					return "pop";
//    				}},
//    				GROW_UP{
//    				public String toString(){
//    					return "grow-up";
//    			}},
//    			DROP{
//    				public String toString(){
//    					return "drop";
//    			}};
//    		}
        public OnShow(){
        }
        
        public Float getCascade() {
			return cascade;
		}
        
		public void setCascade(Float cascade) {
			this.cascade = cascade;
		}
		
		public Float getDelay() {
			return delay;
		}
		
		public void setDelay(Float delay) {
			this.delay = delay;
		}
		

        public String getType() {
            return type;
        }
        public void setType(String type) {
            this.type = type;
        }
        
//        public void setType_pop() {
//            this.type = "pop";
//        }
//        public void setType_grow_up() {
//            this.type = "grow-up";
//        }
//        public void setType_drop() {
//            this.type = "drop";
//        }
        
    }

