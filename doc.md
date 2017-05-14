

1. uib-datepicker-popup is an attribute in an input element 

<input type="text" class="form-control" uib-datepicker-popup ng-model="start_dt.value" is-open="opendt['start_dt']"> 


2. Directive requires'ngModel' and 'uibDatepickerPopup' which instantiates them and passes them into the 4th argument for controllers in the link property of the directive.  Controller for directive is also uibDatepickercontroller

3. In the link property, init is called on the uibDatePickerPopupController with ngModelController passed as an argument

    link: function(scope, element, attrs, ctrls) {
      var ngModel = ctrls[0],
        ctrl = ctrls[1];

      ctrl.init(ngModel);
    }

  a. This sets a variety of options such as date format, either ones passed to it in the uib-datepicker-popup attribute or by default in the datePckerpopupConfig object

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

4. 







