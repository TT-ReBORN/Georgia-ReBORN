/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Utility Linked List                  * //
// * Author:         TT                                                  * //
// * Org. Author:    TheQwertiest                                        * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2022-12-29                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////
// * UTILITY LINKED LIST * //
/////////////////////////////
/**
 * @constructor
 * @template T
 */
function LinkedList() {
	/**
	 * @param {T} value
	 * @param {?Node} prev
	 * @param {?Node} next
	 * @constructor
	 * @struct
	 * @template T
	 */
	function Node(value, prev, next) {
		this.value = value;
		this.prev = prev;
		this.next = next;
	}

	this.clear = () => {
		back = null;
		front = null;
		size = 0;
	};

	/**
	 * @param {T} value
	 */
	this.push_back = (value) => {
		add_node(new Node(value, back, null));
	};

	/**
	 * @param {T} value
	 */
	this.push_front = (value) => {
		add_node(new Node(value, null, front));
	};

	this.pop_front = () => {
		remove_node(front);
	};

	this.pop_back = () => {
		remove_node(back);
	};

	/**
	 * @param {LinkedList.Iterator<T>} iterator
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
	 * @return {T}
	 */
	this.front = () => front.value;

	/**
	 * @return {T}
	 */
	this.back = () => back.value;

	/**
	 * @return {number}
	 */
	this.length = () => size;

	/**
	 * This method creates Iterator object
	 * @return {LinkedList.Iterator<T>}
	 */
	this.begin = function () {
		return new LinkedList.Iterator(this, front || this.end_node);
	};

	/**
	 * This method creates Iterator object
	 * @return {LinkedList.Iterator<T>}
	 */
	this.end = function () {
		return new LinkedList.Iterator(this, this.end_node);
	};

	/**
	 * @param {Node} node
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
	 * @param {?Node} node
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
}


/**
 * @param {LinkedList} parent
 * @param {Node} node
 * @constructor
 * @template T
 */
LinkedList.Iterator = function (parent, node) {
	this.increment = function () {
		if (this.cur_node === parent.end_node) {
			throw new LogicError('Iterator is out of bounds');
		}

		this.cur_node = this.cur_node.next;
		if (!this.cur_node) {
			this.cur_node = parent.end_node;
		}
	};

	this.decrement = function () {
		if (this.cur_node === front) {
			throw new LogicError('Iterator is out of bounds');
		}

		this.cur_node = this.cur_node === parent.end_node ? back : this.cur_node.prev;
	};

	/**
	 * @return {T}
	 */
	this.value = function () {
		if (this.cur_node === parent.end_node) {
			throw new LogicError('Accessing end node');
		}

		return this.cur_node.value;
	};

	/**
	 * @param {LinkedList.Iterator} iterator
	 * @return {boolean}
	 */
	this.compare = function (iterator) {
		if (iterator.parent !== this.parent) {
			throw new LogicError('Comparing iterators from different lists');
		}
		return iterator.cur_node === this.cur_node;
	};

	/** @const {LinkedList} */
	this.parent = parent;
	/** @type {Node} */
	this.cur_node = node;
};
