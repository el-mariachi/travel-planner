export const tripsTemplate = `
{{# sch }}
<div class="trips__list trips--status-scheduled">
    <h2 class="trips__header">Scheduled Trips</h2>
    <ul class="trips__inner">
{{# scheduled }}
        <li class="trips__item" data-index="{{ index }}"><span class="trips__data">
                <span class="trips__name">{{name}}, {{countryName}}</span><span
                    class="trips__countdown">{{ countdown }}</span>
            </span></li>
{{/ scheduled }}
    </ul>
</div>
{{/ sch }}
{{# cmpl }}
<div class="trips__list trips--status-completed">
    <h2 class="trips__header">Completed Trips</h2>
    <ul class="trips__inner">
{{# completed }}
        <li class="trips__item" data-index="{{ index }}"><span class="trips__data">
                <span class="trips__name">{{name}}, {{countryName}}</span><span
                    class="trips__countdown">{{ countpast }}</span>
            </span></li>
{{/ completed }}
    </ul>
</div>
{{/ cmpl }}
`;