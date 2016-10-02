const Unit = ({name})=><button>{name}</button>

const ListOfUnits = ({units})=><div>{units.map(unit=><Unit name={unit.name}></Unit>)}</div>

export default ({className, name, units})=><div>
  <button>{name}</button>
  <ListOfUnits units={units}></ListOfUnits>
</div>
