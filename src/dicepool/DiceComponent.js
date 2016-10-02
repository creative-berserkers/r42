import css from 'style.css'

const faces = ['⚀','⚁','⚂','⚃','⚄','⚅']

export default ({className,face})=><div className={`${className} ${css.dice}`}>
  {faces[face-1]}
</div>
