const canvas =
    document.getElementById("graficaCanvas");

const ctx =
    canvas.getContext("2d");


let ecuacion =
    ecuacionInicial;

let x0 =
    Number(xInicial);

let y0 =
    Number(yInicial);

let xMin =
    Number(rangoXMin);

let xMax =
    Number(rangoXMax);

let yMin =
    Number(rangoYMin);

let yMax =
    Number(rangoYMax);


let funcionPendiente;


/*
====================================================
CONVERTIR ECUACIÓN
====================================================
*/

function crearFuncionEcuacion(texto) {

    let expresion =
        texto.trim();


    expresion =
        expresion.replace(
            /\^/g,
            "**"
        );


    expresion =
        expresion.replace(
            /\bsqrt\s*\(/gi,
            "Math.sqrt("
        );


    expresion =
        expresion.replace(
            /\bln\s*\(/gi,
            "Math.log("
        );


    expresion =
        expresion.replace(
            /\bsin\s*\(/gi,
            "Math.sin("
        );


    expresion =
        expresion.replace(
            /\bcos\s*\(/gi,
            "Math.cos("
        );


    expresion =
        expresion.replace(
            /\btan\s*\(/gi,
            "Math.tan("
        );


    expresion =
        expresion.replace(
            /\babs\s*\(/gi,
            "Math.abs("
        );


    expresion =
        expresion.replace(
            /\bpi\b/gi,
            "Math.PI"
        );


    expresion =
        expresion.replace(
            /\be\b/g,
            "Math.E"
        );


    expresion =
        expresion.replace(
            /\s+/g,
            ""
        );


    const valida =
        /^[0-9xy+\-*/()._a-zA-Z]+$/.test(
            expresion
        );


    if (!valida) {

        throw new Error(
            "La ecuación contiene caracteres no permitidos."
        );

    }


    return new Function(

        "x",

        "y",

        `
        "use strict";
        return ${expresion};
        `

    );

}


function actualizarFuncion() {

    try {

        funcionPendiente =
            crearFuncionEcuacion(
                ecuacion
            );

        return true;

    } catch (error) {

        mostrarError(
            error.message
        );

        return false;

    }

}


function pendiente(x, y) {

    try {

        const resultado =
            funcionPendiente(x, y);


        if (
            typeof resultado !== "number"
        ) {

            return NaN;

        }


        if (
            !Number.isFinite(resultado)
        ) {

            return NaN;

        }


        return resultado;

    } catch {

        return NaN;

    }

}


function mostrarError(mensaje) {

    document.getElementById(
        "procedimiento"
    ).innerHTML = `

        <div class="advertencia">

            <strong>Error:</strong>

            ${mensaje}

        </div>

    `;

}


/*
====================================================
COORDENADAS DEL CANVAS
====================================================
*/

function px(x) {

    return (

        (x - xMin) /
        (xMax - xMin)

    ) * canvas.width;

}


function py(y) {

    return canvas.height -

        (

            (y - yMin) /
            (yMax - yMin)

        ) * canvas.height;

}


/*
====================================================
PREPARAR CANVAS
====================================================
*/

function prepararCanvas() {

    const rect =
        canvas.getBoundingClientRect();


    canvas.width =
        rect.width;


    canvas.height =
        rect.height;

}


/*
====================================================
CUADRÍCULA
====================================================
*/

function dibujarCuadricula() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.strokeStyle =
        "#e6e6e6";


    ctx.lineWidth = 1;


    for (
        let x = Math.ceil(xMin);
        x <= Math.floor(xMax);
        x++
    ) {

        ctx.beginPath();


        ctx.moveTo(
            px(x),
            0
        );


        ctx.lineTo(
            px(x),
            canvas.height
        );


        ctx.stroke();

    }


    for (
        let y = Math.ceil(yMin);
        y <= Math.floor(yMax);
        y++
    ) {

        ctx.beginPath();


        ctx.moveTo(
            0,
            py(y)
        );


        ctx.lineTo(
            canvas.width,
            py(y)
        );


        ctx.stroke();

    }

}


/*
====================================================
EJES
====================================================
*/

function dibujarEjes() {

    ctx.strokeStyle =
        "#222";


    ctx.lineWidth = 2;


    if (
        yMin <= 0 &&
        yMax >= 0
    ) {

        ctx.beginPath();


        ctx.moveTo(
            0,
            py(0)
        );


        ctx.lineTo(
            canvas.width,
            py(0)
        );


        ctx.stroke();

    }


    if (
        xMin <= 0 &&
        xMax >= 0
    ) {

        ctx.beginPath();


        ctx.moveTo(
            px(0),
            0
        );


        ctx.lineTo(
            px(0),
            canvas.height
        );


        ctx.stroke();

    }


    ctx.fillStyle =
        "#222";


    ctx.font =
        "13px Arial";


    for (
        let x = Math.ceil(xMin);
        x <= Math.floor(xMax);
        x++
    ) {

        if (
            x === 0 ||
            yMin > 0 ||
            yMax < 0
        ) {

            continue;

        }


        ctx.fillText(
            x.toString(),
            px(x) + 3,
            py(0) + 17
        );

    }


    for (
        let y = Math.ceil(yMin);
        y <= Math.floor(yMax);
        y++
    ) {

        if (
            y === 0 ||
            xMin > 0 ||
            xMax < 0
        ) {

            continue;

        }


        ctx.fillText(
            y.toString(),
            px(0) + 7,
            py(y) - 5
        );

    }


    ctx.font =
        "bold 16px Arial";


    if (
        yMin <= 0 &&
        yMax >= 0
    ) {

        ctx.fillText(
            "X",
            canvas.width - 20,
            py(0) - 10
        );

    }


    if (
        xMin <= 0 &&
        xMax >= 0
    ) {

        ctx.fillText(
            "Y",
            px(0) + 10,
            20
        );

    }

}


/*
====================================================
SEGMENTO DE PENDIENTE
====================================================
*/

function segmento(
    x,
    y,
    m,
    longitud,
    color,
    grosor
) {

    if (
        !Number.isFinite(m)
    ) {

        return;

    }


    const mLimitada =
        Math.max(
            -30,
            Math.min(
                30,
                m
            )
        );


    const normal =
        Math.sqrt(
            1 +
            mLimitada *
            mLimitada
        );


    const dx =
        (longitud / 2) /
        normal;


    const dy =
        mLimitada *
        dx;


    const x1 =
        x - dx;


    const y1 =
        y - dy;


    const x2 =
        x + dx;


    const y2 =
        y + dy;


    ctx.beginPath();


    ctx.moveTo(
        px(x1),
        py(y1)
    );


    ctx.lineTo(
        px(x2),
        py(y2)
    );


    ctx.strokeStyle =
        color;


    ctx.lineWidth =
        grosor;


    ctx.stroke();

}


/*
====================================================
CAMPO DE PENDIENTES / ISOCLINAS
====================================================
*/

function dibujarCampo() {

    const paso = 0.5;


    for (
        let x = xMin;
        x <= xMax;
        x += paso
    ) {

        for (
            let y = yMin;
            y <= yMax;
            y += paso
        ) {

            const m =
                pendiente(
                    x,
                    y
                );


            if (
                !Number.isFinite(m)
            ) {

                continue;

            }


            segmento(
                x,
                y,
                m,
                0.30,
                "#2774c6",
                1.3
            );

        }

    }

}


/*
====================================================
VALIDAR PUNTO
====================================================
*/

function puntoValido(
    x,
    y
) {

    const m =
        pendiente(
            x,
            y
        );


    return Number.isFinite(m);

}


/*
====================================================
CURVA SOLUCIÓN
MÉTODO DE EULER
====================================================
*/

function dibujarCurva(
    xInicial,
    yInicial,
    particular = false
) {

    const paso =
        0.01;


    let x =
        xInicial;


    let y =
        yInicial;


    ctx.beginPath();


    ctx.moveTo(
        px(x),
        py(y)
    );


    /*
    HACIA ADELANTE
    */

    for (
        let i = 0;
        i < 3000;
        i++
    ) {

        if (
            x < xMin ||
            x > xMax ||
            y < yMin ||
            y > yMax
        ) {

            break;

        }


        if (
            !puntoValido(
                x,
                y
            )
        ) {

            break;

        }


        const m =
            pendiente(
                x,
                y
            );


        if (
            Math.abs(m) > 100
        ) {

            break;

        }


        y =
            y +
            m * paso;


        x =
            x +
            paso;


        if (
            !puntoValido(
                x,
                y
            )
        ) {

            break;

        }


        ctx.lineTo(
            px(x),
            py(y)
        );

    }


    /*
    HACIA ATRÁS
    */

    x =
        xInicial;


    y =
        yInicial;


    ctx.moveTo(
        px(x),
        py(y)
    );


    for (
        let i = 0;
        i < 3000;
        i++
    ) {

        if (
            x < xMin ||
            x > xMax ||
            y < yMin ||
            y > yMax
        ) {

            break;

        }


        if (
            !puntoValido(
                x,
                y
            )
        ) {

            break;

        }


        const m =
            pendiente(
                x,
                y
            );


        if (
            Math.abs(m) > 100
        ) {

            break;

        }


        y =
            y -
            m * paso;


        x =
            x -
            paso;


        if (
            !puntoValido(
                x,
                y
            )
        ) {

            break;

        }


        ctx.lineTo(
            px(x),
            py(y)
        );

    }


    if (
        particular
    ) {

        ctx.strokeStyle =
            "#e67e22";


        ctx.lineWidth =
            3.5;

    } else {

        ctx.strokeStyle =
            "#168a45";


        ctx.lineWidth =
            1.5;

    }


    ctx.stroke();

}


/*
====================================================
CURVAS
====================================================
*/

function dibujarCurvas() {

    const cantidad = 9;


    const pasoY =
        (yMax - yMin) /
        (cantidad + 1);


    for (
        let i = 1;
        i <= cantidad;
        i++
    ) {

        const y =
            yMin +
            pasoY * i;


        if (
            puntoValido(
                x0,
                y
            )
        ) {

            dibujarCurva(
                x0,
                y,
                false
            );

        }

    }


    if (
        puntoValido(
            x0,
            y0
        )
    ) {

        dibujarCurva(
            x0,
            y0,
            true
        );

    }

}


/*
====================================================
PUNTO INICIAL
====================================================
*/

function dibujarPunto() {

    const m =
        pendiente(
            x0,
            y0
        );


    if (
        !Number.isFinite(m)
    ) {

        return;

    }


    segmento(
        x0,
        y0,
        m,
        0.8,
        "#e67e22",
        4
    );


    ctx.beginPath();


    ctx.arc(
        px(x0),
        py(y0),
        7,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "red";


    ctx.fill();


    ctx.strokeStyle =
        "#800000";


    ctx.lineWidth =
        2;


    ctx.stroke();


    ctx.fillStyle =
        "#a00000";


    ctx.font =
        "bold 15px Arial";


    ctx.fillText(
        `(${x0}, ${y0})`,
        px(x0) + 12,
        py(y0) - 12
    );

}


/*
====================================================
FORMATO DE ECUACIÓN
====================================================
*/

function formatoEcuacion() {

    return ecuacion

        .replace(
            /\^2/g,
            "²"
        )

        .replace(
            /\^3/g,
            "³"
        )

        .replace(
            /sqrt/g,
            "√"
        )

        .replace(
            /\*/g,
            " · "
        );

}


/*
====================================================
DETECTAR EJERCICIOS ESPECIALES
====================================================
*/

function esParacaidista() {

    return ecuacion

        .replace(/\s/g, "")
        .toLowerCase()

        === "32-1.6*y";

}


function esVenados() {

    return ecuacion

        .replace(/\s/g, "")
        .toLowerCase()

        === "0.0225*y-0.0003*y^2"

        ||
        
        ecuacion
            .replace(/\s/g, "")
            .toLowerCase()

        === "0.0225*y-0.0003*y**2";

}


/*
====================================================
PROCEDIMIENTO ESPECIAL
PARACAIDISTA
====================================================
*/

function procedimientoParacaidista() {

    let html = "";


    html += `

        <div class="paso">

            <strong>
                Paso 5. Encontrar la velocidad límite
            </strong>

            <br><br>

            La velocidad límite se obtiene cuando
            la aceleración es igual a cero:

            <br><br>

            32 - 1.6v = 0

            <br><br>

            1.6v = 32

            <br><br>

            <span class="resultado">

                v = 20 ft/s

            </span>

        </div>

    `;


    html += `

        <div class="paso">

            <strong>
                Paso 6. Solución particular
            </strong>

            <br><br>

            La solución que satisface
            v(0) = 0 es:

            <br><br>

            <span class="resultado">

                v(t) = 20(1 - e<sup>-1.6t</sup>)

            </span>

        </div>

    `;


    html += `

        <div class="paso">

            <strong>
                Paso 7. Calcular el 95% de la velocidad límite
            </strong>

            <br><br>

            95% de 20:

            <br><br>

            0.95(20) = 19 ft/s

            <br><br>

            Entonces:

            <br><br>

            19 = 20(1 - e<sup>-1.6t</sup>)

            <br><br>

            Despejando:

            <br><br>

            t =
            -ln(0.05) / 1.6

            <br><br>

            <span class="resultado">

                t ≈ 1.87 segundos

            </span>

        </div>

    `;


    html += `

        <div class="respuesta-especial">

            <h3>

                Resultado del problema del paracaidista

            </h3>


            <div class="dato">

                Velocidad límite = 20 ft/s

            </div>


            <div class="dato">

                95% de la velocidad límite = 19 ft/s

            </div>


            <div class="dato">

                Tiempo para alcanzar el 95% ≈ 1.87 s

            </div>


            <p>

                La ecuación utilizada describe la velocidad
                durante la caída y permite observar cómo
                la velocidad se aproxima a su valor límite.

            </p>

            <p>

                La pregunta sobre una pila de paja requiere
                un modelo adicional del impacto y la
                desaceleración; esta ecuación por sí sola
                no permite determinar la supervivencia.

            </p>

        </div>

    `;


    return html;

}


/*
====================================================
PROCEDIMIENTO ESPECIAL
VENADOS
====================================================
*/

function procedimientoVenados() {

    let html = "";


    html += `

        <div class="paso">

            <strong>
                Paso 5. Encontrar la población límite
            </strong>

            <br><br>

            La población límite se obtiene cuando
            el crecimiento es igual a cero:

            <br><br>

            0.0225P - 0.0003P² = 0

            <br><br>

            Factorizamos:

            <br><br>

            P(0.0225 - 0.0003P) = 0

            <br><br>

            Por lo tanto:

            <br><br>

            P = 0

            &nbsp;&nbsp;o&nbsp;&nbsp;

            P = 75

            <br><br>

            Como la población inicial es 25 venados,
            la población límite relevante es:

            <br><br>

            <span class="resultado">

                P = 75 venados

            </span>

        </div>

    `;


    html += `

        <div class="paso">

            <strong>
                Paso 6. Solución particular
            </strong>

            <br><br>

            Con P(0) = 25,
            la solución logística es:

            <br><br>

            <span class="resultado">

                P(t) =
                75 / (1 + 2e<sup>-0.0225t</sup>)

            </span>

        </div>

    `;


    html += `

        <div class="paso">

            <strong>
                Paso 7. Calcular cuándo se duplica
                la población
            </strong>

            <br><br>

            La población inicial es:

            <br><br>

            P(0) = 25

            <br><br>

            El doble es:

            <br><br>

            P(t) = 50

            <br><br>

            Sustituimos:

            <br><br>

            50 =
            75 / (1 + 2e<sup>-0.0225t</sup>)

            <br><br>

            Resolviendo:

            <br><br>

            e<sup>-0.0225t</sup> = 0.25

            <br><br>

            t =
            -ln(0.25) / 0.0225

            <br><br>

            <span class="resultado">

                t ≈ 61.58 meses

            </span>

        </div>

    `;


    html += `

        <div class="respuesta-especial">

            <h3>

                Resultado del problema de los venados

            </h3>


            <div class="dato">

                Población límite = 75 venados

            </div>


            <div class="dato">

                Tiempo para duplicarse ≈ 61.58 meses

            </div>


            <div class="dato">

                ≈ 5.13 años

            </div>


            <p>

                La curva solución comienza con
                25 venados y se aproxima progresivamente
                a una población de 75 venados.

            </p>

        </div>

    `;


    return html;

}


/*
====================================================
GENERAR PROCEDIMIENTO
====================================================
*/

function generarProcedimiento() {

    const m =
        pendiente(
            x0,
            y0
        );


    document.getElementById(
        "ecuacionTexto"
    ).textContent =
        "dy/dx = " +
        formatoEcuacion();


    document.getElementById(
        "puntoTexto"
    ).textContent =
        `(${x0}, ${y0})`;


    if (
        Number.isFinite(m)
    ) {

        document.getElementById(
            "pendienteTexto"
        ).textContent =
            m.toFixed(4);

    } else {

        document.getElementById(
            "pendienteTexto"
        ).textContent =
            "No definida";

    }


    let html = "";


    /*
    PASO 1
    */

    html += `

        <div class="paso">

            <strong>

                Paso 1. Identificar la ecuación

            </strong>

            <br><br>

            <strong>

                dy/dx =

            </strong>

            ${formatoEcuacion()}

        </div>

    `;


    /*
    PASO 2
    */

    html += `

        <div class="paso">

            <strong>

                Paso 2. Identificar el punto

            </strong>

            <br><br>

            El punto utilizado es:

            <br><br>

            <strong>

                P = (${x0}, ${y0})

            </strong>

        </div>

    `;


    /*
    PASO 3
    */

    html += `

        <div class="paso">

            <strong>

                Paso 3. Sustituir el punto

            </strong>

            <br><br>

            m = ${formatoEcuacion()}

            <br><br>

            m = ${sustitucionEcuacion()}

        </div>

    `;


    /*
    PASO 4
    */

    if (
        Number.isFinite(m)
    ) {

        html += `

            <div class="paso">

                <strong>

                    Paso 4. Calcular la pendiente

                </strong>

                <br><br>

                ${operacionEcuacion()}

                <br><br>

                <span class="resultado">

                    m = ${m.toFixed(4)}

                </span>

            </div>

        `;

    } else {

        html += `

            <div class="advertencia">

                <strong>

                    La pendiente no está definida
                    en el punto seleccionado.

                </strong>

            </div>

        `;

    }


    /*
    INTERPRETACIÓN
    */

    if (
        Number.isFinite(m)
    ) {

        let interpretacion = "";


        if (
            m > 0
        ) {

            interpretacion =
                "La curva tiene una pendiente positiva en este punto.";

        } else if (
            m < 0
        ) {

            interpretacion =
                "La curva tiene una pendiente negativa en este punto.";

        } else {

            interpretacion =
                "La curva tiene una pendiente igual a cero, por lo que localmente es horizontal.";

        }


        html += `

            <div class="paso">

                <strong>

                    Interpretación

                </strong>

                <br><br>

                ${interpretacion}

                <br><br>

                La solución particular naranja
                pasa por el punto
                <strong>(${x0}, ${y0})</strong>.

            </div>

        `;

    }


    /*
    EJERCICIO PARACAIDISTA
    */

    if (
        esParacaidista()
    ) {

        html +=
            procedimientoParacaidista();

    }


    /*
    EJERCICIO VENADOS
    */

    if (
        esVenados()
    ) {

        html +=
            procedimientoVenados();

    }


    /*
    RESTRICCIÓN LN
    */

    if (
        ecuacion
            .toLowerCase()
            .includes("ln")
    ) {

        html += `

            <div class="advertencia">

                <strong>

                    Restricción matemática:

                </strong>

                ln(y) solamente está definido
                cuando <strong>y &gt; 0</strong>.

            </div>

        `;

    }


    /*
    RESTRICCIÓN RAÍZ
    */

    if (
        ecuacion
            .toLowerCase()
            .includes("sqrt")
    ) {

        html += `

            <div class="advertencia">

                <strong>

                    Restricción matemática:

                </strong>

                √(expresión) solamente está definida
                cuando la expresión dentro de la raíz
                es mayor o igual que cero.

            </div>

        `;

    }


    document.getElementById(
        "procedimiento"
    ).innerHTML =
        html;

}


/*
====================================================
SUSTITUCIÓN
====================================================
*/

function sustitucionEcuacion() {

    return ecuacion

        .replace(
            /\bx\b/g,
            `(${x0})`
        )

        .replace(
            /\by\b/g,
            `(${y0})`
        );

}


/*
====================================================
OPERACIÓN
====================================================
*/

function operacionEcuacion() {

    const resultado =
        pendiente(
            x0,
            y0
        );


    if (
        !Number.isFinite(resultado)
    ) {

        return "No es posible calcularla.";

    }


    return `

        Sustituyendo:

        <br><br>

        ${sustitucionEcuacion()}

        <br><br>

        Resultado numérico:

        <strong>

            ${resultado.toFixed(4)}

        </strong>

    `;

}


/*
====================================================
CARGAR EJEMPLOS
====================================================
*/

document
    .getElementById("ejemplos")
    .addEventListener(
        "change",
        function () {


            if (
                !this.value
            ) {

                return;

            }


            document.getElementById(
                "ecuacion"
            ).value =
                this.value;


            const puntos = {


                "2*x^2*y^2":

                    [1, -1],


                "x*ln(y)":

                    [1, 1],


                "sqrt(x-y)":

                    [2, 1],


                "x^2-y^2":

                    [0, 1],


                "x^2-y":

                    [2, -2],


                "x+y":

                    [1, 2],


                "x-y":

                    [2, 1],


                "sin(x)-y":

                    [2, 1],


                "cos(x)-y":

                    [2, 1],


                /*
                PARACAIDISTA
                */

                "32-1.6*y":

                    [0, 0],


                /*
                VENADOS
                */

                "0.0225*y-0.0003*y^2":

                    [0, 25]

            };


            if (
                puntos[this.value]
            ) {

                document.getElementById(
                    "xInicial"
                ).value =
                    puntos[this.value][0];


                document.getElementById(
                    "yInicial"
                ).value =
                    puntos[this.value][1];

            }


            /*
            RANGOS ESPECIALES
            */

            if (
                this.value ===
                "32-1.6*y"
            ) {

                document.getElementById(
                    "xMin"
                ).value = 0;


                document.getElementById(
                    "xMax"
                ).value = 5;


                document.getElementById(
                    "yMin"
                ).value = 0;


                document.getElementById(
                    "yMax"
                ).value = 22;

            }


            if (
                this.value ===
                "0.0225*y-0.0003*y^2"
            ) {

                document.getElementById(
                    "xMin"
                ).value = 0;


                document.getElementById(
                    "xMax"
                ).value = 100;


                document.getElementById(
                    "yMin"
                ).value = 0;


                document.getElementById(
                    "yMax"
                ).value = 100;

            }

        }
    );


/*
====================================================
INICIAR
====================================================
*/

function iniciar() {

    ecuacion =
        document.getElementById(
            "ecuacion"
        ).value;


    x0 =
        Number(
            document.getElementById(
                "xInicial"
            ).value
        );


    y0 =
        Number(
            document.getElementById(
                "yInicial"
            ).value
        );


    xMin =
        Number(
            document.getElementById(
                "xMin"
            ).value
        );


    xMax =
        Number(
            document.getElementById(
                "xMax"
            ).value
        );


    yMin =
        Number(
            document.getElementById(
                "yMin"
            ).value
        );


    yMax =
        Number(
            document.getElementById(
                "yMax"
            ).value
        );


    if (
        xMin >= xMax ||
        yMin >= yMax
    ) {

        mostrarError(
            "Revise los rangos de la gráfica."
        );

        return;

    }


    if (
        !actualizarFuncion()
    ) {

        return;

    }


    prepararCanvas();


    dibujarCuadricula();

    dibujarEjes();

    dibujarCampo();

    dibujarCurvas();

    dibujarPunto();

    generarProcedimiento();

}


window.addEventListener(
    "resize",
    iniciar
);


document
    .getElementById("formulario")
    .addEventListener(
        "submit",
        function () {

            /*
            PHP recarga la página
            con los valores introducidos.
            */

        }
    );


iniciar();