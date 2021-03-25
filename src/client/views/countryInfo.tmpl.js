export const countryInfoTemplate = `
<div class="trip__category_inner">
    <header class="trip__header">
        <h3 class="trip__category_title">Country info</h3>
    </header>
    <div class="trip__param">
        <span class="trip__param_name">Name</span>
        <span class="trip__param_value">{{ name }}</span>
    </div>
    <div class="trip__param">
        <span class="trip__param_name">Capital</span>
        <span class="trip__param_value">{{ capital }}</span>
    </div>
    <div class="trip__param">
        <span class="trip__param_name">{{ currTitle }}</span>
        <span class="trip__param_value">{{ allCurrencies }}</span>
    </div>
    <div class="trip__param">
        <span class="trip__param_name">{{ langTitle }}</span>
        <span class="trip__param_value">{{ allLanguages }}</span>
    </div>
</div>`;