/**
 * Panel object returned by {@link window.GetPanel} or {@link window.GetPanelByIndex}
 * @hideconstructor
 */
class PanelObject {
   
    /**
     * @type {string}
     * @readonly
     */
    Name = undefined; // (string) (read)
    /**
     * @type {string}
     */
    Text = undefined; // (string) (read, write)
    /**
     * @type {boolean}
     */
    Hidden = undefined; // (boolean) (read, write)
    /**
     * @type {boolean}
     */
    Locked = undefined; // (boolean) (read, write)
    /**
     * @type {boolean}
     */
    ShowCaption = undefined; // (boolean) (read, write)
    /**
     * @type {boolean}
     */
    SupportPseudoTransparency = undefined; // (boolean) (read, write)
    /**
     * @type {number}
     */
    X = undefined; // (int) (read, write)
    /**
     * @type {number}
     */
    Y = undefined; // (int) (read, write)
    /**
     * @type {number}
     */
    Width = undefined; // (int) (read, write)
    /**
     * @type {number}
     */
    Height = undefined; // (int) (read, write)
    /**
     * @type {boolean}
     */
    TopMost = undefined; // (boolean) (read, write)
    /**
     * @type {boolean}
     */
    EraseBackground = undefined; // (boolean) (read, write)

    /**
     * @method
     * @param {boolean=} [show=true]
     */
    Show(show) {}
    /**
     * @method
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {boolean=} [repaintParent=false]
     */
    Move(x, y, width, height, repaintParent = false) { };
}

/**
 * Button object returned by {@link window.CreateButton}
 * @hideconstructor
 */
class ButtonObject {
   
    /**
     * @type {number}
     * @readonly
     */
    ID = undefined; // (ushort) (read)
    /**
     * @type {number}
     */
    X = undefined; // (int) (read, write)
    /**
     * @type {number}
     */
    Y = undefined; // (int) (read, write)
    /**
     * @type {number}
     */
    Width = undefined; // (int) (read, write)
    /**
     * @type {number}
     */
    Height = undefined; // (int) (read, write)
    /**
     * @type {boolean}
     */
    Hidden = undefined; // (boolean) (read, write)
    /**
     * @type {boolean}
     */
    HandOnHover = undefined; // (boolean) (read, write)
    /**
     * @type {boolean}
     */
    State = undefined; // (boolean) (read, write)
    /**
     * Assigns click handler function. See also global callback 'on_button_click'
     * @type {function()}
     * @example
     * let b = window.CreateButton(100, 100, "1.png", null);
     * b.HandOnHover = true;
     * 
     * b.Click = (id) => {
	 *     console.log(`Pressed button with ID = ${id}`);	
     * };
     * 
     * function click(id) {
     *     utils.ShowHtmlDialog(0, `ID = ${id}`);
     * }
     * b.Click = click;
     * 
     * let user = {
     *     name: "DZMITRY",
     *     f(id) {
     *         console.log(`ID = ${id} for ${this.name}`);
     *     }
     * };
     * b.Click = user.f.bind(user);
     */
    Click = function(id) { };

    /**
     * @method
     * @param {boolean=} [show=true]
     */
    Show(show) { };    
    /**
     * @method
     * @param {number} x
     * @param {number} y
     */
    Move(x, y) { };
    /**
    * @method
    * @param {number} width
    * @param {number} height
    */
    Resize(width, height) { };
}
