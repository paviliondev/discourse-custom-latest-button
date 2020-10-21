import DropdownSelectBoxComponent from "select-kit/components/dropdown-select-box";
import computed from 'ember-addons/ember-computed-decorators';
import { alias } from "@ember/object/computed";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";
import DiscourseURL from "discourse/lib/url";

export default DropdownSelectBoxComponent.extend({
  router: service(),
  classNames: ["custom-dropdown-menu"],
  baseUrl: alias('baseHref'),
  
  selectKitOptions: {
    headerComponent: "custom-latest-dropdown-header"
  },
  
  changeFilter(url, filter) {
    return `${url.replace(/\/l\/.*/,'')}/l/${filter}`;
  },
  
  @discourseComputed("router.currentRoute")
  value(currentRoute) {
    return window.location.pathname;
  },

  modifyComponentForRow() {
    return "custom-latest-dropdown-row";
  },

  @discourseComputed('baseUrl')
  content(baseUrl) {
    return [
      {
        id: 'sort_by',
        name: I18n.t(themePrefix('latest_dropdown_items.sort_by'))
      },
      {
        id: this.changeFilter(baseUrl, 'latest'),
        name: I18n.t(themePrefix('latest_dropdown_items.latest_activity'))
      },
      {
        id: this.changeFilter(baseUrl, 'articles'),
        name: I18n.t(themePrefix('latest_dropdown_items.latest_topics'))
      },
      {
        id: `/search`,
        name: I18n.t(themePrefix('latest_dropdown_items.adv_search'))
      }
    ];
  },


  actions: {
    onSelect(item){
      if (item != 'sort_by') {
        DiscourseURL.routeTo(item);
      }
    }
  }
});
