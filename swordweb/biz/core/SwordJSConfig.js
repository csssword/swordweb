/**
 * 用户配置，用于配置swordJS框架
 */

 
function SwordJSConfig() {

    /*
     配置系统样式风格   样式加载优先级 SwordJSConfig > CSSManager > Sword.js
     效果： 配置 sysStyle 为系统中内置的风格名称即可（在CSSManager中定义）
     可以配置整体风格，可以配置每个组件的样式风格
     使用方式：
     1. 每种样式风格的定义方式：系统使用默认大于配置的方式 即
     1）样式目录与组件名称相同
     2）样式风格的文件名称及数量完全一致
     则系统会根据   sysStyle 参数自动到对应的目录中加载样式  每个组件所依赖的样式文件在 sword.js 中定义
     2. 系统内置的所有样式风格根路径为： sword/styles
     用户扩展（若系统内置样式不满足用户需求）：
     1. 若系统内置的样式风格与标准风格所依赖文件不同，则在 CSSManager中定义
     2. 若用户有特殊需求，与系统内置的样式风格不同，则在 SwordJSConfig.cssManager 中定义

     //默认路径，基本不用设置 设置后 sysStyle 路径失效
     sysStyleDefaultPath:""
     //为单独组件配置样式
     ,widgetStyle:{
     SwordTree:{name:"SwordTree",prefixPath:"swordweb/styles/blue/customerTree",cssPath:["customerTree.css"]}
     }
     */
    this.cssManager = {
        /*
         与 CSSManager 中定义的风格名称对应，此风格名称与 styles 下的目录名称对应 默认 SwordDefault
         */
        sysStyle:"SwordDefault"

    };
    this.jsManager = {};
}
