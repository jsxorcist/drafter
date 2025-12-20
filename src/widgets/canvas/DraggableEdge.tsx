import { EdgeProps, BaseEdge, getBezierPath } from "reactflow";

export function DraggableEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  // Get waypoint from data (stored as offset from center)
  const waypoint = data?.waypoint || null;

  // Increased curvature factor: 0.75 instead of 0.5 (50% more curvature)
  const curvatureFactor = 0.75;

  // Create smooth bezier path - waypoint influences control points but path remains smooth
  let edgePath: string;
  if (waypoint) {
    // waypoint is stored as offset from center
    // Calculate how much to pull the curve towards the waypoint
    const pullX = waypoint.x; // Already offset from center
    const pullY = waypoint.y; // Already offset from center
    
    // Get base bezier path from React-Flow
    const [basePath] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });
    
    // Parse the path to extract control points and modify them
    // Format: M x,y C cp1x,cp1y cp2x,cp2y x,y
    const pathMatch = basePath.match(/M ([\d.-]+),([\d.-]+) C ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+)/);
    
    if (pathMatch) {
      const [, , , cp1x, cp1y, cp2x, cp2y] = pathMatch.map(Number);
      
      // Pull control points towards waypoint with increased curvature
      const centerX = (sourceX + targetX) / 2;
      const centerY = (sourceY + targetY) / 2;
      const waypointX = centerX + pullX;
      const waypointY = centerY + pullY;
      
      // Increase curvature by pulling control points more towards waypoint
      const newCp1x = cp1x + (waypointX - cp1x) * 0.7;
      const newCp1y = cp1y + (waypointY - cp1y) * 0.7;
      const newCp2x = cp2x + (waypointX - cp2x) * 0.7;
      const newCp2y = cp2y + (waypointY - cp2y) * 0.7;
      
      edgePath = `M ${sourceX},${sourceY} C ${newCp1x},${newCp1y} ${newCp2x},${newCp2y} ${targetX},${targetY}`;
    } else {
      edgePath = basePath;
    }
  } else {
    // Use React-Flow's getBezierPath which correctly handles handle positions
    // Then modify control points to increase curvature
    const [basePath] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });
    
    // Parse the path to extract control points
    // Format: M x,y C cp1x,cp1y cp2x,cp2y x,y
    const pathMatch = basePath.match(/M ([\d.-]+),([\d.-]+) C ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+)/);
    
    if (pathMatch) {
      const [, , , cp1x, cp1y, cp2x, cp2y] = pathMatch.map(Number);
      
      // Calculate direction from source to target
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate perpendicular direction for increased curvature
      const perpX = dy / (distance || 1);
      const perpY = -dx / (distance || 1);
      
      // Increase curvature - push control points further perpendicular
      const curvatureOffset = distance * (curvatureFactor - 0.5) * 0.8;
      
      // Modify control points to increase curvature
      const newCp1x = cp1x + perpX * curvatureOffset;
      const newCp1y = cp1y + perpY * curvatureOffset;
      const newCp2x = cp2x + perpX * curvatureOffset;
      const newCp2y = cp2y + perpY * curvatureOffset;
      
      edgePath = `M ${sourceX},${sourceY} C ${newCp1x},${newCp1y} ${newCp2x},${newCp2y} ${targetX},${targetY}`;
    } else {
      edgePath = basePath;
    }
  }

  return <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />;
}

