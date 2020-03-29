import DropdownSelectBoxHeaderComponent from "select-kit/components/dropdown-select-box/dropdown-select-box-header";
import discourseComputed from "discourse-common/utils/decorators";

export default DropdownSelectBoxHeaderComponent.extend({
  layoutName: "custom-latest-dropdown-header",
  classNames: ["custom-latest-dropdown-header"],

  @discourseComputed("selectKit.isExpanded")
  caretIcon(isExpanded) {
    return isExpanded ? "caret-up" : "caret-down";
  }
});
