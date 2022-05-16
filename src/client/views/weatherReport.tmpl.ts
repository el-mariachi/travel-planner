export const weatherReportTemplate = `
<div class="trip__temps">
    <span class="trip__temp trip__low trip--unit-metric unit--type-c">{{min_temp}}</span>
    <span class="trip__temp trip__high trip--unit-metric unit--type-c">{{max_temp}}</span>
    <span class="trip__temp trip__low trip--unit-imperial unit--type-f">{{min_tempF}}</span>
    <span class="trip__temp trip__high trip--unit-imperial unit--type-f">{{max_tempF}}</span>
</div>
<div class="trip__param trip__coverage">
    <span class="trip__param_name">Average cloud coverage:</span><span
        class="trip__param_value unit--type-percent">{{clouds}}</span>
</div>
<div class="trip__param trip__precipitation">
    <span class="trip__param_name">Avg precipitation:</span>
    <span class="trip__param_value trip--unit-metric unit--type-mm">{{precip}}</span>
    <span class="trip__param_value trip--unit-imperial unit--type-in">{{precipImp}}</span>
</div>
{{# weather }}
<div id="conditions" class="trip_param">
    <img src="https://www.weatherbit.io/static/img/icons/{{icon}}.png"
        alt="Weather icon" width="60" height="60"> 
    <span class="trip__param_name">{{description}}</span>
</div>
{{/ weather }}
`;
