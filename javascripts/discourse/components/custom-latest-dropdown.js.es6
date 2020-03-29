import DropdownSelectBoxComponent from "select-kit/components/dropdown-select-box";
import computed from 'ember-addons/ember-computed-decorators';
import { alias } from "@ember/object/computed";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";

export default DropdownSelectBoxComponent.extend({
  routing: service('-routing'),
  params: alias('routing.router.currentState.routerJsState.fullQueryParams'),
  classNames: ["custom-dropdown-menu"],
  baseUrl: alias('baseHref'),
  @discourseComputed('params', 'baseUrl')
  value(params, baseUrl){
    if(params['order'] && params['order'] === 'created'){
      return `${baseUrl}?order=created`;
    }
    return `${baseUrl}`;
  },
  selectKitOptions: {
    headerComponent: "custom-latest-dropdown-header"
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
        id: `${baseUrl}`,
        name: I18n.t(themePrefix('latest_dropdown_items.latest_activity'))
      },
      {
        id: `${baseUrl}?order=created`,
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
      if(item != 'sort_by') {
        DiscourseURL.routeTo(item);
      }
    }
  }
});
