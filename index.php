<?php

$ejemplos = [
    "2*x^2*y^2" => "1. 2x²y²  →  y(1) = -1",
    "x*ln(y)"   => "2. x ln(y) →  y(1) = 1",
    "sqrt(x-y)" => "3. √(x-y) →  y(2) = 1",
    "x^2-y^2"   => "4. x² - y² →  y(0) = 1",

    "x^2-y"     => "Ejemplo: x² - y",
    "x+y"       => "Ejemplo: x + y",
    "x-y"       => "Ejemplo: x - y",
    "sin(x)-y"  => "Ejemplo: sen(x) - y",
    "cos(x)-y"  => "Ejemplo: cos(x) - y",

    "32-1.6*y" => "🪂 Paracaidista → v(0) = 0",
    "0.0225*y-0.0003*y^2" => "🦌 Venados → P(0) = 25"
];

$ecuacion = $_POST["ecuacion"] ?? "x^2-y";

$xInicial = $_POST["xInicial"] ?? "2";
$yInicial = $_POST["yInicial"] ?? "-2";

$xMin = $_POST["xMin"] ?? "-5";
$xMax = $_POST["xMax"] ?? "5";

$yMin = $_POST["yMin"] ?? "-5";
$yMax = $_POST["yMax"] ?? "5";

?>

<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Método de Pendientes</title>

    <link rel="stylesheet"
          href="style.css">

</head>

<body>

<div class="contenedor">

    <header>

        <h1>Método de Pendientes</h1>

        <p>
            Campo de pendientes, isoclinas y curvas solución
        </p>

    </header>


    <!-- CONFIGURACIÓN -->

    <section class="configuracion">

        <h2>
            Configuración de la ecuación
        </h2>


        <form method="POST"
              id="formulario">


            <div class="grupo">

                <label for="ejemplos">

                    Cargar una ecuación de ejemplo:

                </label>


                <select id="ejemplos">

                    <option value="">

                        Seleccione un ejemplo...

                    </option>


                    <?php foreach ($ejemplos as $clave => $nombre): ?>

                        <option value="<?= htmlspecialchars($clave) ?>">

                            <?= htmlspecialchars($nombre) ?>

                        </option>

                    <?php endforeach; ?>

                </select>

            </div>


            <div class="grupo">

                <label for="ecuacion">

                    Ecuación diferencial:

                </label>


                <input
                    type="text"
                    id="ecuacion"
                    name="ecuacion"
                    value="<?= htmlspecialchars($ecuacion) ?>"
                    placeholder="Ejemplo: x^2-y"
                    required
                >


                <small>

                    Escriba solamente el lado derecho de
                    <strong>dy/dx</strong>.

                    Por ejemplo:

                    <strong>x^2-y</strong>

                </small>

            </div>


            <div class="fila">


                <div class="grupo">

                    <label for="xInicial">

                        Coordenada X del punto:

                    </label>


                    <input
                        type="number"
                        step="any"
                        id="xInicial"
                        name="xInicial"
                        value="<?= htmlspecialchars($xInicial) ?>"
                        required
                    >

                </div>


                <div class="grupo">

                    <label for="yInicial">

                        Coordenada Y del punto:

                    </label>


                    <input
                        type="number"
                        step="any"
                        id="yInicial"
                        name="yInicial"
                        value="<?= htmlspecialchars($yInicial) ?>"
                        required
                    >

                </div>


            </div>


            <h3>

                Rango de la gráfica

            </h3>


            <div class="fila">


                <div class="grupo">

                    <label for="xMin">

                        X mínimo:

                    </label>


                    <input
                        type="number"
                        step="any"
                        id="xMin"
                        name="xMin"
                        value="<?= htmlspecialchars($xMin) ?>"
                        required
                    >

                </div>


                <div class="grupo">

                    <label for="xMax">

                        X máximo:

                    </label>


                    <input
                        type="number"
                        step="any"
                        id="xMax"
                        name="xMax"
                        value="<?= htmlspecialchars($xMax) ?>"
                        required
                    >

                </div>


            </div>


            <div class="fila">


                <div class="grupo">

                    <label for="yMin">

                        Y mínimo:

                    </label>


                    <input
                        type="number"
                        step="any"
                        id="yMin"
                        name="yMin"
                        value="<?= htmlspecialchars($yMin) ?>"
                        required
                    >

                </div>


                <div class="grupo">

                    <label for="yMax">

                        Y máximo:

                    </label>


                    <input
                        type="number"
                        step="any"
                        id="yMax"
                        name="yMax"
                        value="<?= htmlspecialchars($yMax) ?>"
                        required
                    >

                </div>


            </div>


            <button type="submit">

                Graficar ecuación

            </button>


        </form>


        <div class="ayuda">

            <h3>

                ¿Cómo escribir la ecuación?

            </h3>


            <p>

                Utilice <strong>*</strong> para multiplicar.

            </p>


            <p>

                Potencias:

                <strong>x^2</strong>

            </p>


            <p>

                Raíz:

                <strong>sqrt(x-y)</strong>

            </p>


            <p>

                Logaritmo natural:

                <strong>ln(y)</strong>

            </p>


            <p>

                Seno:

                <strong>sin(x)</strong>

            </p>


            <p>

                Coseno:

                <strong>cos(x)</strong>

            </p>


            <p>

                Ejemplo:

                <strong>2*x^2*y^2</strong>

            </p>

        </div>


    </section>


    <!-- INFORMACIÓN -->

    <section class="informacion">

        <div>

            <strong>Ecuación:</strong>

            <span id="ecuacionTexto"></span>

        </div>


        <div>

            <strong>Punto:</strong>

            <span id="puntoTexto"></span>

        </div>


        <div>

            <strong>Pendiente:</strong>

            <span id="pendienteTexto"></span>

        </div>

    </section>


    <!-- GRÁFICA -->

    <section class="grafica">

        <h2>

            Campo de pendientes y curvas solución

        </h2>


        <canvas id="graficaCanvas"></canvas>


        <div class="leyenda">


            <span>

                <i class="campo"></i>

                Campo de pendientes

            </span>


            <span>

                <i class="curvas"></i>

                Curvas solución

            </span>


            <span>

                <i class="particular"></i>

                Solución particular

            </span>


            <span>

                <i class="punto"></i>

                Punto

            </span>


        </div>

    </section>


    <!-- PROCEDIMIENTO -->

    <section class="procedimiento">

        <h2>

            Procedimiento paso a paso

        </h2>


        <div id="procedimiento"></div>

    </section>


    <!-- EXPLICACIÓN -->

    <section class="explicacion">

        <h2>

            ¿Qué representa la gráfica?

        </h2>


        <p>

            El <strong>campo de pendientes</strong>
            representa mediante pequeños segmentos la pendiente
            de la ecuación diferencial en diferentes puntos.

        </p>


        <p>

            Las <strong>curvas solución</strong>
            siguen la dirección indicada por los segmentos
            del campo.

        </p>


        <p>

            La <strong>solución particular</strong>
            es la curva que pasa exactamente por el punto
            inicial indicado.

        </p>


        <p>

            En problemas de población o caída,
            la gráfica también permite observar
            cómo la solución se aproxima a un
            <strong>valor límite</strong>.

        </p>

    </section>

</div>


<script>

const ecuacionInicial =
    <?= json_encode($ecuacion) ?>;


const xInicial =
    <?= json_encode($xInicial) ?>;


const yInicial =
    <?= json_encode($yInicial) ?>;


const rangoXMin =
    <?= json_encode($xMin) ?>;


const rangoXMax =
    <?= json_encode($xMax) ?>;


const rangoYMin =
    <?= json_encode($yMin) ?>;


const rangoYMax =
    <?= json_encode($yMax) ?>;

</script>


<script src="script.js"></script>

</body>

</html>