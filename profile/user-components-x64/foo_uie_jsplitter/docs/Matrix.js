/**
 * Matrix helpers<br>
 * @module Matrix
*/

/**
 * Matrix class to provide helper functions for transforming the image in 3 dimensions.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nl-d2d1helper-matrix3x2f}<br>
 * May be used for {@link D2DGraphics#SetTransform SetTransform}, {@link D2DGraphics#ApplyTransform ApplyTransform} or {@link module:Effects.Effects Effects.AffineTransform}<br>
 * @memberof module:Matrix
 * @class
 * @hideconstructor
 */
class Matrix3x2 {

    /**
     * Generates identity matrix.
     * @method
     * @return {Float32Array}
     */
    static Identity() {
        return new Float32Array([
            1, 0,
            0, 1,
            0, 0
        ]);
    }

    /**
     * Creates a translation transformation that has the specified x and y displacements.
     * @method
     * @param {float} dx
     * @param {float} dy
     * @return {Float32Array}
     */
    static Translation(dx, dy) {
        return new Float32Array([
            1, 0,
            0, 1,
            dx, dy
        ]);
    }

    /**
     * Creates a scale transformation that has the specified scale factors and center point.
     * @method
     * @param {float} sx
     * @param {float} sy
     * @param {float} centerX
     * @param {float} centerY
     * @return {Float32Array}
     */
    static Scale(sx, sy, centerX, centerY) {
        return new Float32Array([
            sx, 0,
            0, sy,
            centerX - sx * centerX, centerY - sy * centerY
        ]);
    }

    /**
     * Creates a rotation transformation that has the specified angle and center point.
     * @method
     * @param {float} angle
     * @param {float} centerX
     * @param {float} centerY
     * @return {Float32Array}
     */
    static Rotation(angle, centerX, centerY) {
        const angleInRadian = angle * (Math.PI / 180);
        const sinAngle = Math.sin(angleInRadian);
        const cosAngle = Math.cos(angleInRadian);
        return new Float32Array([
            cosAngle, sinAngle,
            -sinAngle, cosAngle,
            centerX - centerX * cosAngle + centerY * sinAngle, centerY - centerX * sinAngle - centerY * cosAngle
        ]);
    }

    /**
     * Creates a skew transformation that has the specified x-axis and y-axis values and center point.
     * @method
     * @param {float} degreeX
     * @return {Float32Array}
     */
    static Skew(angleX, angleY, centerX, centerY) {
        const angleXInRadian = angleX * (Math.PI / 180);
        const angleYInRadian = angleY * (Math.PI / 180);
        const tanAngleX = Math.tan(angleXInRadian);
        const tanAngleY = Math.tan(angleYInRadian);
        return new Float32Array([
            1, tanAngleY,
            tanAngleX, 1,
            -centerY * tanAngleX, -centerX * tanAngleY
        ]);
    }

    /**
     * Returns determinant for specified matrix.
     * @method
     * @param {Float32Array} m
     * @return {float}
     */
    static Determinant(m) {
        return m[0] * m[3] - m[1] * m[2];
    }

    /**
     * Returns product of two or more matrices.
     * @method
     * @param {Array<Float32Array>} matrices
     * @return {Float32Array}
     */
    static Multiply(...matrices) {
        if (matrices.length < 2) {
            throw new Error('At least two matrices are required for multiplication');
        }
        for (const m of matrices) {
            if (!(m instanceof Float32Array) || m.length !== 6) {
                throw new Error('Each matrix must be a Float32Array of 6 numbers');
            }
        }

        function mul(a, b) {
            return new Float32Array([
                a[0] * b[0] + a[1] * b[2],
                a[0] * b[1] + a[1] * b[3],

                a[2] * b[0] + a[3] * b[2],
                a[2] * b[1] + a[3] * b[3],

                a[4] * b[0] + a[5] * b[2] + b[4],
                a[4] * b[1] + a[5] * b[3] + b[5]
            ]);
        }

        let result = matrices[0];
        for (let i = 1; i < matrices.length; i++) {
            result = mul(result, matrices[i]);
        }
        return result;
    }

    /**
     * Uses this matrix m to transform the specified point and returns the result.
     * @method
     * @param {Array<Float32Array>} matrices
     * @return {Object(x, y)}
     */
    static TransformPoint(pointX, pointY, m) {
        return { 
            x: pointX * m[0] + pointY * m[2] + m[4],
            y: pointX * m[1] + pointY * m[3] + m[5]
        };
    }
}

/**
 * Matrix class to provide helper functions for transforming the image in 3 dimensions.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1_1helper/nl-d2d1_1helper-matrix4x4f}<br>
 * May be used for {@link module:Effects.Effects Effects.D3DTransform}<br>
 * @memberof module:Matrix
 * @class
 * @hideconstructor
 */
class Matrix4x4 {

    /**
     * Generates identity matrix.
     * @method
     * @return {Float32Array}
     */
    static Identity() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Generates a transform matrix that translates the projection plane in the X, Y, or Z direction.
     * @method
     * @param {float} x
     * @param {float} y
     * @param {float} z
     * @return {Float32Array}
     */
    static Translation(x, y, z) {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
    }

    /**
     * Generates a transform matrix that scales the projection plane in the X, Y, and/or Z direction.
     * @method
     * @param {float} x
     * @param {float} y
     * @param {float} z
     * @return {Float32Array}
     */
    static Scale(sx, sy, sz) {
        return new Float32Array([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Generates a transform matrix that rotates the projection plane about the X axis.
     * @method
     * @param {float} degreeX
     * @return {Float32Array}
     */
    static RotationX(degreeX) {
        const angleInRadian = degreeX * (Math.PI / 180);
        const sinAngle = Math.sin(angleInRadian);
        const cosAngle = Math.cos(angleInRadian);
        return new Float32Array([
            1, 0, 0, 0,
            0, cosAngle, sinAngle, 0,
            0, -sinAngle, cosAngle, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Generates a transform matrix that rotates the projection plane about the Y axis.
     * @method
     * @param {float} degreeY
     * @return {Float32Array}
     */
    static RotationY(degreeY) {
        const angleInRadian = degreeY * (Math.PI / 180);
        const sinAngle = Math.sin(angleInRadian);
        const cosAngle = Math.cos(angleInRadian);
        return new Float32Array([
            cosAngle, 0, -sinAngle, 0,
            0, 1, 0, 0,
            sinAngle, 0, cosAngle, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Generates a transform matrix that rotates the projection plane about the Z axis.
     * @method
     * @param {float} degreeZ
     * @return {Float32Array}
     */
    static RotationZ(degreeZ) {
        const angleInRadian = degreeZ * (Math.PI / 180);
        const sinAngle = Math.sin(angleInRadian);
        const cosAngle = Math.cos(angleInRadian);
        return new Float32Array([
            cosAngle, sinAngle, 0, 0,
            -sinAngle, cosAngle, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Generates a transform matrix that skews the projection plane in the X direction.
     * @method
     * @param {float} degreeX
     * @return {Float32Array}
     */
    static SkewX(degreeX) {
        const angleInRadian = degreeX * (Math.PI / 180);
        const tanAngle = Math.tan(angleInRadian);
        return new Float32Array([
            1, 0, 0, 0,
            tanAngle, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Generates a transform matrix that skews the projection plane in the Y direction.
     * @method
     * @param {float} degreeY
     * @return {Float32Array}
     */
    static SkewY(degreeY) {
        const angleInRadian = degreeY * (Math.PI / 180);
        const tanAngle = Math.tan(angleInRadian);
        return new Float32Array([
            1, tanAngle, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * A perspective transformation with a depth value.
     * @method
     * @param {float} depth
     * @return {Float32Array}
     */
    static PerspectiveProjection(depth)
    {
        let proj = 0;

        if (depth > 0)
        {
            proj = -1/depth;
        }

        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, proj,
            0, 0, 0, 1
        ]);
    }

    /**
     * Rotates the projection plane about the axis you specify.
     * @method
     * @param {float} x
     * @param {float} y
     * @param {float} z
     * @param {float} degree
     * @return {Float32Array}
     */
    static RotationArbitraryAxis(x, y, z, degree)
    {
        // Normalize the vector represented by x, y, and z
        const magnitude = Math.sqrt(x*x + y*y + z*z);
        x /= magnitude;
        y /= magnitude;
        z /= magnitude;

        const angleInRadian = degree * (Math.PI / 180);
        const sinAngle = Math.sin(angleInRadian);
        const cosAngle = Math.cos(angleInRadian);

        const oneMinusCosAngle = 1 - cosAngle;

        return new Float32Array([
            1             + oneMinusCosAngle * (x * x - 1),
            z  * sinAngle + oneMinusCosAngle *  x * y,
            -y * sinAngle + oneMinusCosAngle *  x * z,
            0,

            -z * sinAngle + oneMinusCosAngle *  y * x,
            1             + oneMinusCosAngle * (y * y - 1),
            x  * sinAngle + oneMinusCosAngle *  y * z,
            0,

            y  * sinAngle + oneMinusCosAngle *  z * x,
            -x * sinAngle + oneMinusCosAngle *  z * y,
            1             + oneMinusCosAngle * (z * z - 1),
            0,

            0, 0, 0, 1
        ]);
    }

    /**
     * Returns product of two or more matrices.
     * @method
     * @param {Array<Float32Array>} matrices
     * @return {Float32Array}
     */
    static Multiply(...matrices) {
        if (matrices.length < 2) {
            throw new Error('At least two matrices are required for multiplication');
        }
        for (const m of matrices) {
            if (!(m instanceof Float32Array) || m.length !== 16) {
                throw new Error('Each matrix must be a Float32Array of 16 numbers');
            }
        }

        function mul(a, b) {
            return new Float32Array([
                a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12], 
                a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13], 
                a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14], 
                a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],

                a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12], 
                a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13], 
                a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14], 
                a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],

                a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12], 
                a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13], 
                a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
                a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],

                a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12], 
                a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13], 
                a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
                a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
            ]);            
            // const result = new Float32Array(16);
            // for (let i = 0; i < 4; i++) {
            //     for (let j = 0; j < 4; j++) {
            //         let sum = 0;
            //         for (let k = 0; k < 4; k++) {
            //             sum += a[i * 4 + k] * b[k * 4 + j];
            //         }
            //         result[i * 4 + j] = sum;
            //     }
            // }
            // return result;
        }

        let result = matrices[0];
        for (let i = 1; i < matrices.length; i++) {
            result = mul(result, matrices[i]);
        }
        return result;
    }

    /**
     * Returns determinant for specified matrix.
     * @method
     * @param {Float32Array} m
     * @return {float}
     */
    static Determinant(m)
    {
        const minor1 = m[12] * (m[1] * (m[6] * m[11] - m[10] * m[7]) - m[2] * (m[5] * m[11] - m[7] * m[9]) + m[3] * (m[5] * m[10] - m[6] * m[9]));
        const minor2 = m[13] * (m[0] * (m[4] * m[11] - m[8] * m[7]) - m[2] * (m[4] * m[11] - m[7] * m[8]) + m[3] * (m[4] * m[10] - m[6] * m[8]));
        const minor3 = m[14] * (m[0] * (m[5] * m[11] - m[9] * m[7]) - m[1] * (m[4] * m[11] - m[7] * m[8]) + m[3] * (m[4] * m[9] - m[5] * m[8]));
        const minor4 = m[15] * (m[0] * (m[5] * m[10] - m[9] * m[6]) - m[1] * (m[4] * m[10] - m[6] * m[8]) + m[2] * (m[4] * m[9] - m[5] * m[8]));

        return minor1 - minor2 + minor3 - minor4;
    }
}
