let myShopping = []
const inputBtn = document.getElementById("input-btn")
const deleteBtn = document.getElementById("delete-btn")
const inputEl = document.getElementById("input-el")
const ulEl = document.getElementById("ul-el")
const tabBtn = document.getElementById("tabs-btn")
let i
let removeBtn = document.getElementsByTagName("span")

//load items from storage
loadShopItems()

//eventlisteners
inputBtn.addEventListener("click", () => {
    addShoppingItem(inputEl.value)
})
inputEl.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
        addShoppingItem(inputEl.value)
    }
})
deleteBtn.addEventListener("dblclick", clearShoppingItems)
tabBtn.addEventListener("click", addTab)


//adding item into array
function addShoppingItem(inputValue) {
    if (inputValue.includes("http://") || inputValue.includes("https://")) {
        myShopping.push(inputValue)
    }
    else if (inputValue === "") {
        alert("Please enter a value in the input field")
    }
    else {
        inputValue = "https://" + inputValue
        myShopping.push(inputValue)
    }
    inputEl.value = ""
    localStorage.setItem("myShopping", JSON.stringify(myShopping))
    renderShoppingItems(myShopping)
    lineRemoval()
}

//render items out on the screen
function renderShoppingItems(items) {
    let listItems = ""
    for (let i = 0; i < items.length; i++) {
        /* listItems += "<li><a href='" + myShopping[i] + "' target='_blank' alt='" + myShopping[i] + "'>" + myShopping[i] + "</a></li>"  */
        //template strings
        listItems += `
            <li>
                <a href='${items[i]}' target='_blank' alt='${items[i]}'>${items[i]}</a><span id='listItem${i}' class='deleteitem'></span>
            </li> 
        `
    }
    ulEl.innerHTML = listItems
}

//get URL from the active tab and make an item out if it
function addTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let activeTab = tabs[0]
        addShoppingItem(activeTab.url)
    })
}

//load items from the localstorage
function loadShopItems() {
    if (localStorage.getItem("myShopping")) {
        myShopping = JSON.parse(localStorage.getItem("myShopping"))
        if (myShopping.length > 0) {
        renderShoppingItems(myShopping)
        lineRemoval()
    }
    }
}

//clear the localstorage
function clearShoppingItems() {
    localStorage.clear()
    ulEl.innerHTML = ""
    myShopping = []
    lineRemoval()
}

//system for the line-by-line removal
function lineRemoval() {
    removeBtn = document.getElementsByTagName("span")
    i = 0
    for (i = 0; i < removeBtn.length; i++) {
        removeBtn[i].onclick = function() {
        let a = this.previousSibling
        let index = myShopping.indexOf(a.textContent)
        myShopping.splice(index, 1)
        localStorage.setItem("myShopping", JSON.stringify(myShopping))
        renderShoppingItems(myShopping)
        lineRemoval()
      } 
    }
}