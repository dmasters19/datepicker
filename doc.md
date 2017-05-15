

1. uib-datepicker-popup is an attribute in an input element 

<input type="text" class="form-control" uib-datepicker-popup ng-model="start_dt.value" is-open="opendt['start_dt']"> 


2. Directive requires'ngModel' and 'uibDatepickerPopup' which instantiates them and passes them into the 4th argument for controllers in the link property of the directive.  Controller for directive is also uibDatepickercontroller

3. In the link property, init is called on the uibDatePickerPopupController with ngModelController passed as an argument

    link: function(scope, element, attrs, ctrls) {
      var ngModel = ctrls[0],
        ctrl = ctrls[1];

      ctrl.init(ngModel);
    }

  a. This sets a number of options such as date format, either ones passed to it in the uib-datepicker-popup attribute or by default in the datePckerpopupConfig object

  b. It creates the calendar element 

    popupEl = angular.element('<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>');

    popupEl.attr({
        'ng-model': 'date',
        'ng-change': 'dateSelection(date)',
        'template-url': datepickerPopupTemplateUrl
    });

    // datepicker element
    datepickerEl = angular.element(popupEl.children()[0]);
    datepickerEl.attr('template-url', datepickerTemplateUrl);
    datepickerEl.attr('datepicker-options', 'datepickerOptions');

    $element.after($popup);

4. The <div uib-datepicker-popup-wrap> element loads "uib/template/datepickerPopup/popup.html", although this can be changed with the template-url attribute (on the original input element Im guessing, but not sure yet)


  angular.module("uib/template/datepickerPopup/popup.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/datepickerPopup/popup.html",
      "<ul role=\"presentation\" class=\"uib-datepicker-popup dropdown-menu uib-position-measure\" dropdown-nested ng-if=\"isOpen\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
      "  <li ng-transclude></li>\n" +
      "  <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
      "    <span class=\"btn-group pull-left\">\n" +
      "      <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today', $event)\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
      "      <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null, $event)\">{{ getText('clear') }}</button>\n" +
      "    </span>\n" +
      "    <button type=\"button\" class=\"btn btn-sm btn-success pull-right uib-close\" ng-click=\"close($event)\">{{ getText('close') }}</button>\n" +
      "  </li>\n" +
      "</ul>\n" +
      "");
  }]);

  a. The <ul> includes the entire datepicker.  The ng-transclude inserts whatever is inside the element of uib-datepicker-popup, which is another directive, uib-datepicker. <div uib-datepicker-popup-wrap><div uib-datepicker></div></div>  

  That instantiates the directive uibdatepicker (line 1271) which loads the template uib/template/datepicker/datepicker.html and constructs the UibDatePickerCtrl, datepickerCtrl.init(ngModelCtrl).

5. 'uib/template/datepicker/datepicker.html' is a wrapper for the switching between day/month/year view.

  angular.module("uib/template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/datepicker.html",
    "<div ng-switch=\"datepickerMode\">\n" +
    "  <div uib-daypicker ng-switch-when=\"day\" tabindex=\"0\" class=\"uib-daypicker\"></div>\n" +
    "  <div uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\" class=\"uib-monthpicker\"></div>\n" +
    "  <div uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\" class=\"uib-yearpicker\"></div>\n" +
    "</div>\n" +
    "");
  }]);

6.  This intializes another directive, uib-daypicker (assuming we wont care about monthpicker and certainly not yearpicker)

  a.  It initializes the daypickerctrl with the argument of datepicker controller being given as an argument

    daypickerCtrl.init(datepickerCtrl);

  b.  It uses the template 'uib/template/datepicker/day.html'

    angular.module("uib/template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/day.html",
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
    "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></button></th>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
    "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-weeks\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
    "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-day text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-sm\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
  }]);

  Let's descontruct the above further

  The :: indicates a ONE-TIME-BINDING.  An expression that starts with :: is considered a one-time expression. One-time expressions will stop recalculating once they are stable, which happens after the first digest if the expression result is a non-undefined value (see value stabilization algorithm below).  The uniqueId is generated in the UibDatepickerCtrl to synchronize labels

    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" 

    I'm not sure what activeDatID is for yet.  Active descendant Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application.  I think all atributes prefixed with aria are to make the application more usable to those with disabilities using screen readers

    aria-activedescendant=\"{{activeDateId}}\">\n" +

    This is the month previous button, aria-hidden only applies to screen readers.
    <span class=sr-only> stands for screen-reader only and is also for the aria initiative

    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n"

    
    This is the title element which will span 5 columns if week numbers are not show and 6 if theyre shown.  {{title}} is the current title (May 2017)

    "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +

    This is the month next button

    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></button></th>\n" +

    Center text if showing weeks

    <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +


    This is to label the days of the week Sun, Mon, Tues, etc. at the top of the calendar

  
    "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +

    
    ng-repeat through weeks (rows)

    <tr class=\"uib-weeks\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +

    Show week numbers if applicable

    <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></


Conversion

uib/template/datepicker/datepicker.html is unnecessary.  There won't be any switching between day/month/year views.  Only the month view will be available.  However I'm not going to remove it yet for fear of breaking some dependencies in the controllers



  




