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
  
  changeFilter(path, filter) {
    return `${path.replace(/\/l\/.*/,'')}/l/${filter}`;
  },
  
  changeQueryParam(path, param, value) {
    return `${path.replace(/\?.*/,'')}?${param}=${value}`;
  },
  
  applyOrder(path, order, isTemplateCategory) {
    if (isTemplateCategory) {
      return this.changeQueryParam(path, 'order', 'activity');
    } else {
      return this.changeQueryParam(path, 'order', order);
    }
  },
  
  @discourseComputed('category')
  isTemplateCategory(category) {
    return category &&
      category.id == this.siteSettings.composer_template_category;
  },
  
  @discourseComputed("currentPath", "isTemplateCategory")
  value(currentPath, isTemplateCategory) {
    let filter = isTemplateCategory ? 'articles' : 'latest';
    
    const pathFilter = /\/l\/(.*?)(\?|$)/i.exec(currentPath);
    if (pathFilter && ['latest', 'articles'].indexOf(pathFilter[1]) > -1) {
      filter = pathFilter[1];
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const order = urlParams.get('order') || 'activity';

    let result = this.applyOrder(
      this.changeFilter(currentPath, filter),
      order,
      isTemplateCategory
    )
    return result;
  },

  modifyComponentForRow() {
    return "custom-latest-dropdown-row";
  },

  @discourseComputed('currentPath', 'isTemplateCategory')
  content(currentPath, isTemplateCategory) {
    const path = this.currentPath;
    
    let activityId = this.applyOrder(
      this.changeFilter(path, 'latest'),
      'activity',
      isTemplateCategory
    );
    
    let topicsId = this.applyOrder(
      this.changeFilter(path, isTemplateCategory ? 'articles' : 'latest'),
      'created',
      isTemplateCategory
    );
        
    return [
      {
        id: 'sort_by',
        name: I18n.t(themePrefix('latest_dropdown_items.sort_by'))
      },
      {
        id: activityId,
        name: I18n.t(themePrefix('latest_dropdown_items.latest_activity'))
      },
      {
        id: topicsId,
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
