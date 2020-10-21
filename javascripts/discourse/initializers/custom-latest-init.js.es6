
import { withPluginApi } from "discourse/lib/plugin-api";
import { on } from "discourse-common/utils/decorators";

export default {
  name: "custom-latest-button",
  initialize() {
    withPluginApi("0.8.33", themeInit);
  }
}

const themeInit = (api) => {
  api.modifyClass("component:navigation-item", {
    @on('didReceiveAttrs')
    changeTemplate() {
      if (this.get('content.name') === "latest" && !this.site.mobileView) {
        this.set('baseHref', this.get('content.href'));
        const template = api._lookupContainer('template:custom-latest-button');
        this.set('hrefLink', null)
        this.set('layout', template);
      }
    }
  });
} 