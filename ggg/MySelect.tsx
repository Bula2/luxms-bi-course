import React, { useState, useEffect } from "react";

import { Select } from "@consta/uikit/Select";
import { Text } from "@consta/uikit/Text";

const MySelect: React.FC<any> = ({ MyServiceExample, item }) => {
  const [value, setValue] = useState<any>();

  const handleChangeValue = (value: any) => {
    MyServiceExample.handleChangeFilters(value);
    setValue(value);
  };

  useEffect(() => {
    MyServiceExample.handleStopLoading();
  }, [MyServiceExample.isLoading]);

  useEffect(() => {
    setValue("");
  }, [MyServiceExample.isResetNeeded]);

  return (
    <>
      <Text style={{alignSelf: "flex-start", paddingLeft: "40px"}}>{item?.placeholder}</Text>
      <Select
        placeholder={item?.placeholder}
        items={item?.selectItems}
        value={value}
        onChange={({ value }) => handleChangeValue(value)}
        style={{
          zIndex: 100,
          maxWidth: "90%",
          marginBottom: "20px",
        }}
      />
    </>
  );
};

export default MySelect;
