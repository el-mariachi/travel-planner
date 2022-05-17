export const weatherReportTemplate = `
<div class="trip__temps">
    <span class="trip__temp trip__low trip--unit-metric unit--type-c">{{tempmin}}</span>
    <span class="trip__temp trip__high trip--unit-metric unit--type-c">{{tempmax}}</span>
    <span class="trip__temp trip__low trip--unit-imperial unit--type-f">{{tempminF}}</span>
    <span class="trip__temp trip__high trip--unit-imperial unit--type-f">{{tempmaxF}}</span>
</div>
<div class="trip__param trip__coverage">
    <span class="trip__param_name">Average cloud coverage:</span><span
        class="trip__param_value unit--type-percent">{{cloudcover}}</span>
</div>
<div class="trip__param trip__precipitation">
    <span class="trip__param_name">Avg precipitation:</span>
    <span class="trip__param_value trip--unit-metric unit--type-mm">{{precip}}</span>
    <span class="trip__param_value trip--unit-imperial unit--type-in">{{precipImp}}</span>
</div>
<div id="conditions" class="trip_param">
    <img src="{{icon}}.svg"
        alt="Weather icon" width="60" height="60"> 
    <span class="trip__param_name">{{conditions}}</span>
</div>
`;
