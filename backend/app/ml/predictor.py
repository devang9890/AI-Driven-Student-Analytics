import os
from typing import Union

import joblib
import numpy as np

# Fallback rules if model files are missing
from app.services.risk_service import get_risk_hint


_THIS_DIR = os.path.dirname(__file__)
_MODEL_DIR = os.path.join(_THIS_DIR, "models")
_MODEL_PATH = os.path.join(_MODEL_DIR, "risk_model.pkl")
_ENCODER_PATH = os.path.join(_MODEL_DIR, "label_encoder.pkl")

_model = None
_label_encoder = None


def _load_artifacts():
    global _model, _label_encoder
    if _model is not None and _label_encoder is not None:
        return
    if os.path.exists(_MODEL_PATH) and os.path.exists(_ENCODER_PATH):
        _model = joblib.load(_MODEL_PATH)
        _label_encoder = joblib.load(_ENCODER_PATH)


def predict_risk(attendance_pct: Union[int, float], avg_marks: Union[int, float], lms_score: int) -> str:
    """Predict risk label using trained model if available; otherwise use rule-based hint."""
    try:
        _load_artifacts()
        if _model is not None and _label_encoder is not None:
            # Build feature vector: [attendance_percentage, average_marks, lms_score]
            X = np.array([[float(attendance_pct), float(avg_marks), int(lms_score)]])
            y_pred = _model.predict(X)
            # Decode to original string labels
            label = _label_encoder.inverse_transform(y_pred)[0]
            return label
    except Exception:
        # Fall back to rules on any error
        pass

    # Fallback: rules-based
    return get_risk_hint(attendance_pct, avg_marks, lms_score)
