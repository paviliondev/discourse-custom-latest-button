import DropdownSelectBoxComponent from "select-kit/components/dropdown-select-box";
import computed from 'ember-addons/ember-computed-decorators';
import { alias } from "@ember/object/computed";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";
import DiscourseURL from "discourse/lib/url";

export default DropdownSelectBoxComponent.extend({
  router: service(),
  classNames: ["custom-dropdown-menu"],
  currentPath: alias('router.currentURL'),
  category: alias('router.currentRoute.attributes.category'),
  
  selectKitOptions: {
    headerComponent: "custom-latest-dropdown-header"
  },
  
  changeFilter(filter) {
    return `${this.currentPath.replace(/\/l\/.*/,'')}/l/${filter}`;
  },
  
  changeQueryParam(param, value) {
    return `${this.currentPath.replace(/\?.*/,'')}?${param}=${value}`;
  },
  
  @discourseComputed('category')
  isTemplateCategory(category) {
    return category &&
      category.id == this.siteSettings.composer_template_category;
  },
  
  @discourseComputed("currentPath", "isTemplateCategory")
  value(currentPath, isTemplateCategory) {
    const baseFilter = currentPath.split('/l/')[1];
    const defaultFilter = isTemplateCategory ? 'articles' : 'latest';
    const filter = ['latest', 'articles'].indexOf(baseFilter) > -1 ? baseFilter : defaultFilter;
    return this.changeFilter(filter);
  },

  modifyComponentForRow() {
    return "custom-latest-dropdown-row";
  },

  @discourseComputed('currentPath', 'isTemplateCategory')
  content(currentPath, isTemplateCategory) {
    const latestId = isTemplateCategory ?
      this.changeFilter('articles') :
      this.changeQueryParam('order', 'created');
        
    return [
      {
        id: 'sort_by',
        name: I18n.t(themePrefix('latest_dropdown_items.sort_by'))
      },
      {
        id: this.changeFilter('latest'),
        name: I18n.t(themePrefix('latest_dropdown_items.latest_activity'))
      },
      {
        id: latestId,
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
