import { findClient } from "./clientsApi.js";
import { createClientItem } from "./createClientItem.js";

let timeout;

export const searchClients = (clients) => {
    const findList = document.querySelector('.find-list');
    const input = document.querySelector('.header__input');

    clients.forEach(client => {
        const findItem = document.createElement('li');
        const findLink = document.createElement('a');

        findItem.classList.add('find-list__item');
        findLink.classList.add('find-list__link');

        findLink.textContent = `${client.surname} ${client.name} ${client.lastName}`;
        findLink.href = '#';

        findItem.append(findLink);
        findList.append(findItem);
    });

    const rewriteTable = async (str) => {
        const response = await findClient(str);
        const tbody = document.querySelector('.clients__tbody');
        tbody.innerHTML = '';

        for (const client of response) {
            tbody.append(createClientItem(client));
        }
    }

    // const debounce = (fn, ms) => {
    //     let timeout;
    //     return function () {
    //       const fnCall = () => { fn.apply(this, arguments) }
    //       clearTimeout(timeout);
    //       timeout = setTimeout(fnCall, ms)
    //     };
    // }

    // function onChange(e) {
    //     let res = findClient()
    //     // console.log(e.target.value);
    // }

    // onChange = debounce(onChange, 300);

    // input.addEventListener('keyup', onChange)

    input.addEventListener('input', async () => {
        const value = input.value.trim();
        const foundItems = document.querySelectorAll('.find-list__link');

        if (value !== '') {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                rewriteTable(value);
            }, 1000)
            // rewriteTable(value);

            foundItems.forEach(link => {
                if (link.innerText.search(value) == -1) {
                    link.classList.add('hide');
                    link.innerHTML = link.innerText;
                } else {
                    link.classList.remove('hide');
                    findList.classList.remove('hide');
                    const str = link.innerText;
                    link.innerHTML = insertMark(str, link.innerText.search(value), value.length);
                }
            })
        } else {
            foundItems.forEach(link => {
                const tbody = document.querySelector('.clients__tbody');
                tbody.innerHTML = '';

                clients.forEach(client => tbody.append(createClientItem(client)));

                link.classList.remove('hide');
                findList.classList.add('hide');
                link.innerHTML = link.innerText;
            })
        }
    });

    const insertMark = (str, pos, len) => str
        .slice(0, pos) + '<mark>' + str
        .slice(pos, pos + len) + '</mark>' + str
        .slice(pos + len);
}