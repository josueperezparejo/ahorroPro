import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { Accordion, AccordionBody, AccordionHeader, AccordionList, BadgeDelta, Card, Divider } from '@tremor/react';
import { Nubank } from './components';
import "./App.css"

const isValidNumber = (value) => {
  // Permitir solo números y un punto decimal
  return /^-?\d*\.?\d*$/.test(value);
}

const handleKeyDown = (e) => {
  // Permitir teclas de control como Backspace, Tab, Enter, etc.
  const controlKeys = [
    'Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End', 'Delete'
  ];

  if (controlKeys.includes(e.key)) {
    return;
  }

  // Permitir números y un solo punto decimal
  const isNumberKey = e.key >= '0' && e.key <= '9';
  const isDecimalPoint = e.key === '.';

  if (!isNumberKey && !isDecimalPoint) {
    e.preventDefault();
  }
}

const cleanCurrencyInput = (value) => {
  // Limpiar el valor de la moneda (eliminar símbolos y espacios)
  return value.replace(/[^\d.]/g, '');
}

function App() {
  const [capital, setCapital] = useState('');
  const [interes, setInteres] = useState('');
  const [periodoAnios, setPeriodoAnios] = useState('');
  const [periodoMeses, setPeriodoMeses] = useState('');
  const [periodoDias, setPeriodoDias] = useState('');
  const [resultado, setResultado] = useState('');
  const [interesGenerado, setInteresGenerado] = useState('');

  const calcularInteresCompuesto = (capital, interesAnual, periodoAnios, periodoMeses, periodoDias) => {
    const capitalNum = parseFloat(cleanCurrencyInput(capital));
    const interesAnualDecimal = parseFloat(interesAnual) / 100;

    let periodoAniosNum = parseInt(periodoAnios);
    let periodoMesesNum = parseInt(periodoMeses);
    let periodoDiasNum = parseInt(periodoDias);

    if (isNaN(capitalNum) || isNaN(interesAnualDecimal)) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Por favor, llena los campos.",
        showConfirmButton: false,
        timer: 1500
      });
      return null;
    }

    // Convertir los períodos a días para facilitar el cálculo
    let totalDias = 0;

    // Convertir años a días
    if (!isNaN(periodoAniosNum)) {
      totalDias += periodoAniosNum * 365;
    }

    // Convertir meses a días (considerando 30 días por mes)
    if (!isNaN(periodoMesesNum)) {
      totalDias += periodoMesesNum * 30;
    }

    // Sumar días adicionales si se especificaron
    if (!isNaN(periodoDiasNum)) {
      totalDias += periodoDiasNum;
    }

    // Calcular el monto final después del período
    const montoFinal = capitalNum * Math.pow(1 + interesAnualDecimal, totalDias / 365);

    // Calcular el interés ganado
    const interesGanado = montoFinal - capitalNum;

    return interesGanado; // Devolver el interés ganado sin redondear a dos decimales aquí
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  }

  const handleChange = (setter, minValue, maxValue, errorMessage) => (e) => {
    const value = e.target.value;

    // Verificar si el valor es un número válido
    if (isValidNumber(value) && value >= 0) {
      // Verificar el rango solo si se han proporcionado minValue y maxValue
      if ((minValue !== undefined && value < minValue) || (maxValue !== undefined && value > maxValue)) {
        // Mostrar mensaje de advertencia si está fuera del rango
        Swal.fire({
          position: "center",
          icon: "warning",
          title: `${errorMessage}`,
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        setter(value);
      }
    }
  };




  const handleClickCalcular = () => {
    const interesGanado = calcularInteresCompuesto(capital, interes, periodoAnios, periodoMeses, periodoDias);
    if (interesGanado !== null) {
      setInteresGenerado(`${formatCurrency(interesGanado)} COP`)
      let total = parseFloat(capital) + interesGanado
      setResultado(`${formatCurrency(total)} COP`);
    }
  };

  const handleClean = () => {
    setCapital('')
    setInteres('')
    setPeriodoAnios('')
    setPeriodoMeses('')
    setPeriodoDias('')
    setResultado('')
    setInteresGenerado('')
  }

  return (
    <div className="container mx-auto flex justify-center">
      <div className=''>
        <h1 className='text-2xl font-bold mb-3 text-secondary-600'>Calculadora de Intereses Compuestos</h1>
        <div className='my-4'>
          <label className='font-semibold text-1xl text-secondary-600 mb-3 pb-2' htmlFor="capital">Capital inicial:</label>
          <Input
            variant='flat'
            radius='sm'
            color='secondary'
            label="Ingresa el capital inicial"
            placeholder="0.00"
            value={capital}
            onChange={handleChange(setCapital)}
            onKeyDown={handleKeyDown}
            labelPlacement='outside'
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            type="text"
          />
        </div>
        <div className='my-4'>
          <label className='font-semibold text-1xl text-secondary-600 mb-3 pb-2' htmlFor="interes">Tasa de interés anual (%):</label>
          <Input
            radius='sm'
            color='secondary'
            label="Ingresa la tasa de interés anual"
            placeholder="0.00"
            value={interes}
            onChange={handleChange(setInteres, 0, 100)}
            onKeyDown={handleKeyDown}
            step="0.01"
            labelPlacement='outside'

            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">%</span>
              </div>
            }
            type="text"
          />
        </div>
        <div className='my-4'>
          <label className='font-semibold text-1xl text-secondary-600 mb-3 pb-2' htmlFor="periodo">Período:</label>
          <div className="flex items-center gap-3">
            <Input
              radius='sm'
              color='secondary'
              label="Años"
              placeholder="0"
              value={periodoAnios}
              onChange={handleChange(setPeriodoAnios, 0, 100, "El período es demasiado largo, intenta con uno más corto.")}
              onKeyDown={handleKeyDown}
              labelPlacement='outside'
              type="number"
            />
            <Input
              radius='sm'
              color='secondary'
              label="Meses"
              placeholder="0"
              value={periodoMeses}
              onChange={handleChange(setPeriodoMeses, 0, 12, "Intenta agregar más años o días.")}
              onKeyDown={handleKeyDown}
              labelPlacement='outside'
              type="number"
            />
            <Input
              radius='sm'
              color='secondary'
              label="Días"
              placeholder="0"
              value={periodoDias}
              onChange={handleChange(setPeriodoDias, 0, 365, "Intenta agregar más años o meses.")}
              onKeyDown={handleKeyDown}
              labelPlacement='outside'
              type="number"
            />
          </div>
        </div>
        <div className='flex gap-3'>
          <Button className='w-full' onClick={handleClickCalcular} color="secondary">
            Calcular
          </Button>

          <Button onClick={handleClean} className='w-full' variant="bordered" color="secondary">
            Limpiar
          </Button>
        </div>

        <div className='my-8'>
          <Card className="mx-auto max-w-xl" decoration="top" decorationColor="purple">
            <div className="flex items-center justify-between">
              <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">El interés ganado será:</h4>
              <BadgeDelta deltaType={!resultado ? "unchanged" : "increase"} isIncreasePositive={true} size="xs" >            {interesGenerado || `${formatCurrency(0)} COP`}        </BadgeDelta>
            </div>
            <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{!resultado ? `${formatCurrency(0)} COP` : resultado}</p>
          </Card>
        </div>

        <div className='mx-auto max-w-xl'>
          <h2 className='font-bold text-xl mb-3 text-purple-800'>FAQ</h2>
          <AccordionList>
            <Accordion>
              <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong  text-left">
                ¿Cómo se define un año en esta aplicación?
              </AccordionHeader>
              <AccordionBody className="leading-6 text-left">
                En esta aplicación, un año siempre tiene 365 días.
              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong  text-left">
                ¿Cómo se define un mes en esta aplicación?
              </AccordionHeader>
              <AccordionBody className="leading-6 text-left">
                En esta aplicación, un mes siempre tiene 30 días.
              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong  text-left">
                ¿Cómo se define un día en esta aplicación?
              </AccordionHeader>
              <AccordionBody className="leading-6 text-left">
                En esta aplicación, un día puede ser cualquier cantidad de tiempo que el usuario desee calcular, pero cada día siempre tiene 24 horas.
              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong  text-left">
                ¿Por qué los meses tienen 30 días?
              </AccordionHeader>
              <AccordionBody className="leading-6 text-left">
                Para simplificar los cálculos, hemos definido que todos los meses tienen 30 días, eliminando la variabilidad de los meses con diferente cantidad de días en el calendario gregoriano.
              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong  text-left">
                ¿Por qué los años tienen 365 días?
              </AccordionHeader>
              <AccordionBody className="leading-6 text-left">
                Al igual que con los meses, simplificamos los cálculos definiendo que todos los años tienen 365 días, eliminando los años bisiestos.
              </AccordionBody>
            </Accordion>
          </AccordionList>
        </div>

        <Nubank />
      </div>
    </div>
  );
}

export default App;