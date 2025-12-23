class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        this.head = new Node(-1, -1);
        this.tail = new Node(-1, -1);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    get(key) {
        if (!this.map.has(key)) return -1;
        let node = this.map.get(key);
        this.remove(node);
        this.insert(node);
        return node.value;
    }

    put(key, value) {
        if (this.map.has(key)) {
            let node = this.map.get(key);
            node.value = value;
            this.remove(node);
            this.insert(node);
        } else {
            if (this.map.size === this.capacity) {
                let lru = this.tail.prev;
                this.map.delete(lru.key);
                this.remove(lru);
            }
            let newNode = new Node(key, value);
            this.insert(newNode);
            this.map.set(key, newNode);
        }
    }

    insert(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}

let cache = null;

function setCapacity() {
    let cap = Number(document.getElementById("capacity").value);
    cache = new LRUCache(cap);
    document.getElementById("capacity-status").innerText =
        `Capacity set to ${cap}`;
    updateUI();
}

function put() {
    let key = document.getElementById("put-key").value;
    let value = document.getElementById("put-value").value;
    cache.put(key, value);
    document.getElementById("put-status").innerText =
        `Inserted (${key}, ${value})`;
    updateUI();
}

function get() {
    let key = document.getElementById("get-key").value;
    let res = cache.get(key);
    document.getElementById("get-result").innerText =
        res === -1 ? "Not Found" : `Value = ${res}`;
    updateUI();
}

function updateUI() {
    let div = document.getElementById("cache");
    div.innerHTML = "";

    let current = cache.head.next;
    let size = cache.map.size;
    let i = 0;

    while (current !== cache.tail) {
        let box = document.createElement("div");
        box.className = "cache-box " +
            (i === 0 ? "mru" : i === size - 1 ? "lru" : "normal");

        box.innerHTML = `
            <div class="key">${current.key}</div>
            <div class="value">${current.value}</div>
        `;
        div.appendChild(box);

        current = current.next;
        i++;
    }

    document.getElementById("usage").innerText =
        `Capacity Used: ${size} / ${cache.capacity}`;
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const btn = document.querySelector(".theme-btn");
    btn.innerText = document.body.classList.contains("dark-theme")
        ? "☀️"
        : "🌙";
}

