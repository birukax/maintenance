// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchUnitOfMeasures } from "../../store/slices/unitOfMeasureSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const unitOfMeasureColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.unitOfMeasure.unitOfMeasures,
    fetchListAction: fetchUnitOfMeasures,
  });

  return (
    <GenericListPage
      title="Unit of Measures"
      entityState={entityState}
      columns={unitOfMeasureColumns}
      createRoute="/unit-of-measure/create"
      detailRouteBase="/unit-of-measure/detail"
      onRefresh={entityState.refresh}
      getKey={(unitOfMeasure) => unitOfMeasure.id}
    />
  );
};

export default List;
