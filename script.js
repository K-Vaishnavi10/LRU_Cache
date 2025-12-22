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
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _add(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (!this.map.has(key)) return -1;
        const node = this.map.get(key);
        this._remove(node);
        this._add(node);
        return node.value;
    }

    put(key, value) {
        let removed = null;

        if (this.map.has(key)) {
            this._remove(this.map.get(key));
        }

        const node = new Node(key, value);
        this._add(node);
        this.map.set(key, node);

        if (this.map.size > this.capacity) {
            removed = this.tail.prev;
            this._remove(removed);
            this.map.delete(removed.key);
        }

        return removed;
    }

    getNodes() {
        let arr = [];
        let cur = this.head.next;
        while (cur !== this.tail) {
            arr.push(cur);
            cur = cur.next;
        }
        return arr;
    }
}

let cache = null;

/* ========== RENDER FUNCTION ========== */
function render(text = "") {
    const container = document.getElementById("cache-container");
    const explanation = document.getElementById("explanation");
    const capacityInfo = document.getElementById("capacity-info");

    explanation.innerText = text;
    capacityInfo.innerText = `Cache Usage: ${cache.map.size} / ${cache.capacity}`;

    container.innerHTML = "";

    const nodes = cache.getNodes();

    nodes.forEach((node, i) => {
        const box = document.createElement("div");
        box.className = "cache-box";

        if (i === 0) box.classList.add("mru");
        if (i === nodes.length - 1) box.classList.add("lru");

        const k = document.createElement("div");
        k.className = "cache-key";
        k.innerText = node.key;

        const v = document.createElement("div");
        v.className = "cache-value";
        v.innerText = node.value;

        box.appendChild(k);
        box.appendChild(v);
        container.appendChild(box);

        if (i !== nodes.length - 1) {
            const arrow = document.createElement("span");
            arrow.className = "arrow";
            arrow.innerText = "→";
            container.appendChild(arrow);
        }
    });
}

/* ========== ACTIONS ========== */
function setCapacity() {
    const cap = parseInt(document.getElementById("capacity").value);
    if (cap < 1 || isNaN(cap)) {
        alert("Enter valid capacity");
        return;
    }
    cache = new LRUCache(cap);
    render(`Cache initialized with capacity ${cap}`);
}

function putCache() {
    if (!cache) return alert("Set capacity first");

    const key = document.getElementById("key").value;
    const value = document.getElementById("value").value;
    if (!key || !value) return alert("Enter key & value");

    const removed = cache.put(key, value);

    const msg = removed
        ? `Put (${key},${value}) → Cache full, removed LRU (${removed.key})`
        : `Put (${key},${value}) → Added to cache`;

    render(msg);
}

function getCache() {
    if (!cache) return alert("Set capacity first");

    const key = document.getElementById("key").value;
    if (!key) return alert("Enter key");

    const val = cache.get(key);
    const msg = val === -1
        ? `Get (${key}) → Not found`
        : `Get (${key}) → Value ${val}, moved to MRU`;

    render(msg);
}
