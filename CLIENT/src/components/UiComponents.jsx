function UiComponents() {
  return (
    <div>
      <p>버튼시스템</p>
      <button className="btn-primary-s">btn-primary-s</button>
      <button className="btn-primary-s" disabled={true}>
        btn-primary-s
      </button>
      <button className="btn-primary-r">btn-primary-r</button>
      <button className="btn-primary-r" disabled={true}>
        btn-primary-r
      </button>
    </div>
  );
}

export default UiComponents;
