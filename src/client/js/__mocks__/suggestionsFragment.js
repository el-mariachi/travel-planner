export const suggestionsFragment = jest.fn(() => {
    const li = document.createElement('li');
    li.textContent = 'List Item';
    const fragment = new DocumentFragment();
    fragment.appendChild(li);
    return fragment;
});