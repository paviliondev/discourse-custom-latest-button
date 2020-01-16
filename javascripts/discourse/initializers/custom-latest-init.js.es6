
import { withPluginApi } from "discourse/lib/plugin-api";
import {
  on,
  observes,
  default as discourseComputed
} from "discourse-common/utils/decorators";
export default {
  name: "custom-latest-button",
  initialize() {
    withPluginApi("0.8.33", themeInit);
  }

}

const themeInit = (api) => {
  api.modifyClass("component:navigation-item", {
    @on('didInsertElement')
    changeLink() {
      if(this.get("hrefLink") == "/latest") {
        this.set("hrefLink", null);
        this.set("showDropdown", false);
        const context = this;
        const current = this.$();
        this.$().click(function(e){
          if(context.get("showDropdown")){
            current.append('<div class="custom-dropdown">Faiz<div>');
          } else {
            current.find(".custom-dropdown").remove();
          }
          context.toggleProperty("showDropdown");
          console.log(context.get("showDropdown"));
        });
        
      }
    } ,
    @on('didRender')
    clickHandler(){
      
      
    }
  });
} 