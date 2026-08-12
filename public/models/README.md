# 3D Models

Drop the hero model here:

    public/models/Porsche_911.glb

The Phase 2 Hero (`Hero3D`) loads it from `/models/Porsche_911.glb`.

Tips for best results / performance:
- Compress with Draco or Meshopt if the file is large (>8 MB).
- Center the model at the origin; real-world scale (meters) works well with the camera rig.
- Keep PBR materials (metallic/roughness) — the HDRI environment will reflect off them.
