const Unit = ({name})=><button>{name}</button>

const ListOfUnits = ({units})=><div>{units.map((unit, index)=><Unit key={index} name={unit.name}></Unit>)}</div>

export default ({className, name, units})=><div>
  <button>{name}</button>
  <ListOfUnits units={units}></ListOfUnits>
</div>
