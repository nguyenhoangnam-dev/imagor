import React, { useEffect, useState } from "react";

// Color
import { CustomPicker } from "react-color";
import {
  EditableInput,
  Hue,
  Saturation,
} from "react-color/lib/components/common";

import tinyColor from "tinycolor2";

export const ColorPicker = (props) => {
  const [rgb, setRgb] = useState({
    r: 0,
    g: 0,
    b: 0,
  });
  const [hsv, setHsv] = useState({
    h: 0,
    s: 0,
    v: 0,
  });
  const [hex, setHex] = useState("#000000");

  var inputStyles = {
    wrap: {
      display: "flex",
      alignItem: "center",
      flexDirection: "row-reverse",
    },
    input: {
      width: "40%",
      height: "18px",
      border: "1px solid #888888",
      boxShadow: "inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC",
      marginBottom: "5px",
      fontSize: "13px",
      paddingLeft: "3px",
    },
    label: {
      width: "24px",
      textTransform: "uppercase",
      fontSize: "13px",
      height: "18px",
      lineHeight: "22px",
    },
  };

  const handleChange = (data, e) => {
    if (data["#"]) {
      props.onChange(
        {
          hex: data["#"],
          source: "hex",
        },
        e
      );
    } else if (data.r || data.g || data.b) {
      const color = tinyColor({
        r: data.r || rgb.r,
        g: data.g || rgb.g,
        b: data.b || rgb.b,
      });

      props.onChange(
        {
          hex: color.toHexString(),
          source: "hex",
        },
        e
      );
    } else if (data.h || data.s || data.v) {
      const color = tinyColor({
        h: data.h || hsv.h,
        s: data.s || hsv.s,
        v: data.v || hsv.v,
      });
      props.onChange(
        {
          hex: color.toHexString(),
          source: "hsv",
        },
        e
      );
    }
  };

  useEffect(() => {
    if (props.color) {
      const color = tinyColor(props.color);

      setRgb(color.toRgb());
      setHsv(color.toHsv());
      setHex(props.color);
    }
  }, [props.color]);

  return (
    <div className="color-picker">
      <div className="flex">
        <div className="saturation">
          <Saturation {...props} />
        </div>
        <div className="hue">
          <Hue {...props} direction="vertical" />
        </div>
        <div style={{ width: 100 }}>
          <EditableInput
            style={inputStyles}
            label="h"
            value={Math.round(hsv.h)}
            onChange={handleChange}
          />
          <EditableInput
            style={inputStyles}
            label="s"
            value={Math.round(hsv.s * 100)}
            onChange={handleChange}
          />
          <EditableInput
            style={inputStyles}
            label="v"
            value={Math.round(hsv.v * 100)}
            onChange={handleChange}
          />
          <EditableInput
            style={inputStyles}
            label="r"
            value={rgb.r}
            onChange={handleChange}
          />
          <EditableInput
            style={inputStyles}
            label="g"
            value={rgb.g}
            onChange={handleChange}
          />
          <EditableInput
            style={inputStyles}
            label="b"
            value={rgb.b}
            onChange={handleChange}
          />
          <EditableInput
            style={inputStyles}
            label="#"
            value={hex.replace("#", "")}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomPicker(ColorPicker);
