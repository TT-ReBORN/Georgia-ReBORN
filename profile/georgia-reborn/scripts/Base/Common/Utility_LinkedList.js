/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Utility Linked List                  * //
// * Author:         TT                                                  * //
// * Org. Author:    TheQwertiest                                        * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-09-25                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////
// * UTILITY LINKED LIST * //
/////////////////////////////
/**
 * Constructs a LinkedList instance.
 * @template T
 * @class
 * @returns {LinkedList} A LinkedList instance to manage the list of elements.
 */
function LinkedList() {
	// * CONSTRUCTOR * //
	/** @type {?Node} */
	let back = null;
	/** @type {?Node} */
	let front = null;
	/** @type {number} */
	let size = 0;

	/**
	 * @const {Node}
	 */
	this.end_node = new Node(null, null, null);

	/**
	 * Defines a Node object with properties for value, previous node, and next node.
	 * @param {T} value The value of the node. It can be any data type, such as a number, string, object, or even another node.
	 * @param {?Node} prev The previous node in a linked list.
	 * @param {?Node} next The next node in a linked list.
	 * @template T
	 * @struct
	 * @class
	 */
	function Node(value, prev, next) {
		this.value = value;
		this.prev = prev;
		this.next = next;
	}

	/**
	 * Adds a node to a linked list and updates the previous and next pointers accordingly.
	 * @param {Node} node A node in a linked list.
	 */
	function add_node(node) {
		if (node.prev) {
			node.prev.next = node;
		}
		else {
			front = node;
		}

		if (node.next) {
			node.next.prev = node;
		}
		else {
			back = node;
		}

		++size;
	}

	/**
	 * Removes a node from a linked list and updates the previous and next pointers accordingly.
	 * @param {?Node} node A node in a linked list.
	 */
	function remove_node(node) {
		if (!node) {
			return;
		}

		if (node.prev) {
			node.prev.next = node.next;
		}
		else {
			front = node.next;
		}

		if (node.next) {
			node.next.prev = node.prev;
		}
		else {
			back = node.prev;
		}

		--size;
	}

	// * METHODS * //

	/**
	 * Clears all elements from the linked list.
	 * @returns {void}
	 */
	this.clear = () => {
		back = null;
		front = null;
		size = 0;
	};

	/**
	 * Pushes a new value to the back of the queue.
	 * @param {T} value The value to push.
	 */
	this.push_back = (value) => {
		add_node(new Node(value, back, null));
	};

	/**
	 * Pushes a new value to the front of the queue.
	 * @param {T} value The value to push.
	 */
	this.push_front = (value) => {
		add_node(new Node(value, null, front));
	};

	/**
	 * Removes the value at the front of the queue.
	 * @returns {T} The value that was removed.
	 */
	this.pop_front = () => {
		remove_node(front);
	};

	/**
	 * Removes the value at the back of the queue.
	 * @returns {T} The value that was removed.
	 */
	this.pop_back = () => {
		remove_node(back);
	};

	/**
	 * Removes the value at the given iterator.
	 * @param {LinkedList.Iterator<T>} iterator The iterator to remove.
	 * @returns {T} The value that was removed.
	 */
	this.remove = function (iterator) {
		if (!(iterator instanceof LinkedList.Iterator)) {
			throw new InvalidTypeError(iterator, typeof iterator, 'Iterator');
		}

		if (iterator.parent !== this) {
			throw new LogicError('Using iterator from a different list');
		}

		if (iterator.compare(this.end())) {
			throw new LogicError('Removing invalid iterator');
		}

		remove_node(iterator.cur_node);

		iterator.cur_node = this.end_node;
	};

	/**
	 * Gets the value at the front of the queue.
	 * @returns {T} The value at the front of the queue.
	 */
	this.front = () => front.value;

	/**
	 * Gets the value at the back of the queue.
	 * @returns {T} The value at the back of the queue.
	 */
	this.back = () => back.value;

	/**
	 * Gets the number of elements in the queue.
	 * @returns {number} The number of elements in the queue.
	 */
	this.length = () => size;

	/**
	 * Gets an iterator for the beginning of the queue.
	 * @returns {LinkedList.Iterator<T>} An iterator for the beginning of the queue.
	 */
	this.begin = function () {
		return new LinkedList.Iterator(this, front || this.end_node);
	};

	/**
	 * Gets an iterator for the end of the queue.
	 * @returns {LinkedList.Iterator<T>} An iterator for the end of the queue.
	 */
	this.end = function () {
		return new LinkedList.Iterator(this, this.end_node);
	};
}


/**
 * Encapsulates a linked list iterator and is used to iterate through the list.
 * @param {LinkedList} parent The parent of the node.
 * @param {Node} node The node that is pointed to by the iterator.
 * @template T
 * @class
 */
LinkedList.Iterator = function (parent, node) {
	// * CONSTRUCTOR * //
	/** @const {LinkedList} */
	this.parent = parent;

	/** @type {Node} */
	this.cur_node = node;

	// * METHODS * //

	/**
	 * Increments the iterator to the next element.
	 * @returns {void}
	 */
	this.increment = function () {
		if (this.cur_node === parent.end_node) {
			throw new LogicError('Iterator is out of bounds');
		}

		this.cur_node = this.cur_node.next;
		if (!this.cur_node) {
			this.cur_node = parent.end_node;
		}
	};

	/**
	 * Decrements the iterator to the previous element.
	 * @returns {void}
	 */
	this.decrement = function () {
		if (this.cur_node === front) {
			throw new LogicError('Iterator is out of bounds');
		}

		this.cur_node = this.cur_node === parent.end_node ? back : this.cur_node.prev;
	};

	/**
	 * Gets the value of the current element.
	 * @returns {T} The value of the current element.
	 */
	this.value = function () {
		if (this.cur_node === parent.end_node) {
			throw new LogicError('Accessing end node');
		}

		return this.cur_node.value;
	};

	/**
	 * Compares this iterator to another iterator.
	 * @param {LinkedList.Iterator} iterator The other iterator to compare to.
	 * @returns {boolean} True or false.
	 */
	this.compare = function (iterator) {
		if (iterator.parent !== this.parent) {
			throw new LogicError('Comparing iterators from different lists');
		}
		return iterator.cur_node === this.cur_node;
	};
};
