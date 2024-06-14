import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import Swal from 'sweetalert2';
import './App.css';
import { Accordion, AccordionBody, AccordionHeader, AccordionList, BadgeDelta, Card, Divider } from '@tremor/react';

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
        title: "Por favor, ingresa valores válidos.",
        showConfirmButton: false,
        timer: 1500
      });
      return null;
    }

    // Verificar si al menos una de las variables tiene un valor mayor que cero
    const hasValue = (!isNaN(periodoAniosNum) && periodoAniosNum > 0) ||
      (!isNaN(periodoMesesNum) && periodoMesesNum > 0) ||
      (!isNaN(periodoDiasNum) && periodoDiasNum > 0);

    if (hasValue) {
      // Asignar cero a las variables NaN
      if (isNaN(periodoAniosNum)) {
        periodoAniosNum = 0;
      }
      if (isNaN(periodoMesesNum)) {
        periodoMesesNum = 0;
      }
      if (isNaN(periodoDiasNum)) {
        periodoDiasNum = 0;
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Agrega un período valido.",
        showConfirmButton: false,
        timer: 1500
      });
      return null;
    }

    // Convertir los períodos a años para facilitar el cálculo
    const totalPeriodoAnios = periodoAniosNum + periodoMesesNum / 12 + periodoDiasNum / 365;

    // Calcular el monto final después del período
    const montoFinal = capitalNum * Math.pow(1 + interesAnualDecimal, totalPeriodoAnios);

    // Calcular el interés ganado
    const interesGanado = montoFinal - capitalNum;

    return interesGanado; // Devolver el interés ganado sin redondear a dos decimales aquí
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  }

  const handleChange = (setter) => (e) => {
    const value = e.target.value;
    if (isValidNumber(value)) {
      setter(value);
    }
  };

  const handleClickCalcular = () => {
    const interesGanado = calcularInteresCompuesto(capital, interes, periodoAnios, periodoMeses, periodoDias);
    if (interesGanado !== null) {
      setResultado(`${formatCurrency(interesGanado)} COP`);
    }
  };

  const handleClean = () => {
    setCapital('')
    setInteres('')
    setPeriodoAnios('')
    setPeriodoMeses('')
    setPeriodoDias('')
    setResultado('')
  }

  return (
    <div className="container mx-auto flex justify-center">
      <div className=''>
        <h1 className='text-2xl font-bold mb-3 text-secondary-600'>Calculadora de Intereses Compuestos</h1>
        <div className='my-4'>
          <label className='font-semibold text-1xl text-secondary-600 mb-2' htmlFor="capital">Capital inicial:</label>
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
          <label className='font-semibold text-1xl text-secondary-600 mb-2' htmlFor="interes">Tasa de interés anual (%):</label>
          <Input
            radius='sm'
            color='secondary'
            label="Ingresa la tasa de interés anual"
            placeholder="0.00"
            value={interes}
            onChange={handleChange(setInteres)}
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
          <label className='font-semibold text-1xl text-secondary-600 mb-2' htmlFor="periodo">Período:</label>
          <div className="flex items-center gap-3">
            <Input
              radius='sm'
              color='secondary'
              label="Años"
              placeholder="0"
              value={periodoAnios}
              onChange={handleChange(setPeriodoAnios)}
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
              onChange={handleChange(setPeriodoMeses)}
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
              onChange={handleChange(setPeriodoDias)}
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

        <div className='my-3'>
          {resultado &&
            
            <Card className="mx-auto max-w-xl" decoration="top" decorationColor="purple">
            <div className="flex items-center justify-between">
              <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">El interés ganado será:</h4>
              <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true} size="xs" >          +9.3%        </BadgeDelta>
            </div>
            <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{resultado}</p>
          </Card>}
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
        </div>
        <AccordionList>
          <Accordion>
            <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Accordion 1
            </AccordionHeader>
            <AccordionBody className="leading-6">        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus        tempor lorem non est congue blandit. Praesent non lorem sodales,        suscipit est sed, hendrerit dolor.
            </AccordionBody>
          </Accordion>
          <Accordion>
            <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Accordion 2
            </AccordionHeader>
            <AccordionBody className="leading-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus        tempor lorem non est congue blandit. Praesent non lorem sodales,        suscipit est sed, hendrerit dolor.      </AccordionBody>    </Accordion>
          <Accordion>
            <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Accordion 3
            </AccordionHeader>
            <AccordionBody className="leading-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus        tempor lorem non est congue blandit. Praesent non lorem sodales,        suscipit est sed, hendrerit dolor.      </AccordionBody>
          </Accordion>
        </AccordionList>
      </div>
    </div>
  );
}

export default App;