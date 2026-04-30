//CLIENT COMPONENT

"use client";

import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "reactflow";
import { CldImage } from "next-cloudinary";
import "reactflow/dist/style.css";

import dagre from "dagre";

// layout config
const nodeWidth = 160;
const nodeHeight = 75;
const profileImageSize = 40;
const CUSTOM_NODE_TYPE = 'profileNode';
const tooltipOffsetX = 10;
const tooltipOffsetY = -5;

// dagre layout function
function getLayoutedElements(nodes, edges, direction = "TB") {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

// Custom Node Component with Profile Image and Info Button
function ProfileNode({ data, onInfoClick }) {
  const { label, fullData, isRoot, id } = data;
  
  // Determine status for styling
  let status = isRoot ? 'approved' : 'unknown';
  if (!isRoot && fullData?.status) {
    const parsedStatus = fullData.status.toLowerCase().trim();
    if (parsedStatus.includes('approved') || parsedStatus.includes('active')) status = 'approved';
    else if (parsedStatus.includes('pending') || parsedStatus.includes('waitlist')) status = 'pending';
    else if (parsedStatus.includes('declined') || parsedStatus.includes('rejected') || parsedStatus.includes('banned')) status = 'declined';
  }
  
  const borderColor = status === 'approved' ? '#83ff83' : status === 'pending' ? '#ffd883' : status === 'declined' ? '#ff6a6a' : '#666666';
  const bgColor = status === 'approved' ? 'rgba(131, 255, 131, 0.15)' : status === 'pending' ? 'rgba(255, 216, 131, 0.15)' : status === 'declined' ? 'rgba(255, 106, 106, 0.15)' : 'rgba(102, 102, 102, 0.15)';
  const textColor = status === 'approved' ? '#059669' : status === 'pending' ? '#d97706' : status === 'declined' ? '#dc2626' : '#6b7280';
  
  const profileImage = fullData?.profile_image;
  
  const handleInfoClick = (e) => {
    e.stopPropagation();
    onInfoClick && onInfoClick(id, fullData);
  };
  
  return (
    <div
      id={`node-${id}`}
      style={{
        width: nodeWidth,
        height: nodeHeight,
        border: `2px solid ${borderColor}`,
        borderRadius: 12,
        background: bgColor,
        color: textColor,
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
      data-node-id={id}
    >
      {/* Target handles for incoming edges - top */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ width: 8, height: 8, background: '#555' }}
      />
      
      {/* Profile Image Placeholder */}
      <div
        style={{
          width: profileImageSize,
          height: profileImageSize,
          borderRadius: '50%',
          background: 'rgba(200, 200, 200, 0.3)',
          border: profileImage ? 'none' : `1px dashed ${textColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Cloudinary profile picture */}
        {profileImage ? (
          <CldImage
            src={profileImage}
            width={profileImageSize}
            height={profileImageSize}
            alt={label || 'Profile'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}
      </div>
      
{/* Name Label */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 500,
          lineHeight: 1.2,
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          marginTop: '2px',
          paddingRight: '18px', // Account for info button space
        }}
      >
        {label}
      </div>
      
      {/* Info Button - click to show tooltip */}
      {!isRoot && (
        <button
          onClick={handleInfoClick}
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: 'none',
            background: textColor,
            color: 'white',
            fontSize: '9px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Click for details"
        >
          i
        </button>
      )}
      
      {/* Source handles for outgoing edges - bottom */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ width: 8, height: 8, background: '#555' }}
      />
    </div>
  );
}

// Enhanced Tooltip Modal Component (centered with black overlay)
function TooltipModal({ data, onClose }) {
  // Determine status for styling (grayscale for status)
  const status = data?.status?.toLowerCase().trim() || 'pending';
  let statusColor = '#555';
  let statusBg = '#f5f5f5';
  let statusBorder = '#999';
  
  if (status.includes('approved') || status.includes('active')) {
    statusColor = '#333';
    statusBg = '#e5e5e5';
    statusBorder = '#666';
  } else if (status.includes('declined') || status.includes('rejected') || status.includes('banned')) {
    statusColor = '#333';
    statusBg = '#ccc';
    statusBorder = '#888';
  }
  
  const profileImage = data?.profile_image;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
<div
        style={{
          background: 'white',
          color: '#555',
          borderRadius: 8,
          fontSize: '16px',
          lineHeight: 1.5,
          minWidth: 320,
          maxWidth: '90%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - plain white with border */}
        <div
          style={{
            background: '#f9f9f9',
            borderBottom: '1px solid #ddd',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Profile Image in Header */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#eee',
              border: '1px solid #ccc',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {profileImage ? (
              <CldImage
                src={profileImage}
                width={56}
                height={56}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ fontSize: 28 }}>
                👤
              </div>
            )}
          </div>
          
          {/* Title and Name */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Member Details
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {data.first_name} {data.last_name}
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#666',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title="Close"
          >
            ×
          </button>
        </div>
        
        {/* Content Body */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
{/* Status Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 400 }}>Status</span>
            <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>
              {data.status || 'pending'}
            </span>
          </div>
          
          {/* Divider */}
          <div style={{ height: 1, background: '#eee', margin: '0 -20px' }} />
          
          {/* Info Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Referral Code */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', color: '#666', fontWeight: 400 }}>Referral Code</span>
              <span style={{ fontSize: '15px', color: '#555', fontWeight: 500, fontFamily: 'monospace', background: '#f5f5f5', padding: '4px 10px', borderRadius: 4 }}>
                {data.referral_code || data.id || 'N/A'}
              </span>
            </div>
            
            {/* Package */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', color: '#666', fontWeight: 400 }}>Package</span>
              <span style={{ fontSize: '15px', color: '#555', fontWeight: 500 }}>
                ₱{data.package || 'N/A'}
              </span>
            </div>
            
            {/* Commission */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', color: '#666', fontWeight: 400 }}>Commission Earned</span>
              <span style={{ fontSize: '16px', fontWeight: 500 }}>
                ₱{data.earnings_from_user || '0.00'}
              </span>
            </div>
            
            {/* Total Referrals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', color: '#666', fontWeight: 400 }}>Total Referrals</span>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>
                {data.total_count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// convert tree → nodes + edges
function convertTreeToGraph(tree) {
  const nodes = [];
  const edges = [];

  function traverse(node, parent = null) {
    const isRoot = node.id === tree.id;
    
    // Status detection - special case for root (always approved green)
    let status = isRoot ? 'approved' : 'unknown';
    let parsedStatus = 'approved'; // Default for root
    
    if (!isRoot) {
      const statusMatch = node.name.match(/\[([^\]]+)\]/i);
      if (statusMatch) {
        parsedStatus = statusMatch[1].toLowerCase().trim();
        if (parsedStatus.includes('approved') || parsedStatus.includes('active')) status = 'approved';
        else if (parsedStatus.includes('pending') || parsedStatus.includes('waitlist')) status = 'pending';
        else if (parsedStatus.includes('declined') || parsedStatus.includes('rejected') || parsedStatus.includes('banned')) status = 'declined';
      }
    }
    
    const borderColor = status === 'approved' ? '#83ff83' : status === 'pending' ? '#ffd883' : status === 'declined' ? '#ff6a6a' : '#666666';
    const bgColor = status === 'approved' ? 'rgba(131, 255, 131, 0.15)' : status === 'pending' ? 'rgba(255, 216, 131, 0.15)' : status === 'declined' ? 'rgba(255, 106, 106, 0.15)' : 'rgba(102, 102, 102, 0.15)';
    const textColor = status === 'approved' ? '#059669' : status === 'pending' ? '#d97706' : status === 'declined' ? '#dc2626' : '#6b7280';
    
    // Compact label
    const label = node.data?.label ?? node.name ?? 'Unknown User';
    
    // Full data for tooltip - handle root and children
    let fullData = node.data?.fullData;
    if (!fullData) {
      // Parse from name for root
      const nameMatch = node.name.match(/^(.+?)\s+\((.+?)\)\s+\[(.+?)\]/);
      if (nameMatch) {
        fullData = {
          first_name: node.name.split(' ')[0],
          last_name: node.name.split(' ')[1] || '',
          status: parsedStatus,
          earnings_from_user: '0.00',
          total_count: 0,
          package: 'N/A'
        };
      } else {
        fullData = {
          first_name: 'N/A',
          last_name: '',
          status: parsedStatus,
          earnings_from_user: '0.00',
          total_count: 0,
          package: 'N/A'
        };
      }
    }
    
    nodes.push({
      id: node.id,
      type: CUSTOM_NODE_TYPE,
      data: { 
        label,
        fullData,
        isRoot,
        id: node.id
      },
      position: { x: 0, y: 0 },
    });

    if (parent) {
      edges.push({
        id: `${parent}-${node.id}`,
        source: parent,
        target: node.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#888', strokeWidth: 2 },
      });
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child, node.id));
    }
  }

  traverse(tree);

  return { nodes, edges };
}

export default function ReferralTree({ data, fetchChildren, maxDepth = 3 }) {
  const [treeData, setTreeData] = React.useState(data);
  const [tooltip, setTooltip] = useState({ show: false, position: {}, data: null });
  const containerRef = useRef(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loadingNodes, setLoadingNodes] = useState(new Set());

  const loadChildren = useCallback(async (nodeId, currentDepth = 1) => {
    const isExpanded = expandedNodes.has(nodeId);
    
    if (loadingNodes.has(nodeId)) return;
    
    if (isExpanded && currentDepth < maxDepth) {
      // Collapse - remove children
      setTreeData(prev => {
        const updateNode = (node) => {
          if (node.id === nodeId) {
            return { ...node, children: [] };
          }
          if (node.children) {
            return {
              ...node,
              children: node.children.map(updateNode)
            };
          }
          return node;
        };
        return updateNode(prev);
      });
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
      return;
    }
    
    if (!isExpanded && currentDepth >= maxDepth) return;
    
    setLoadingNodes(prev => new Set(prev).add(nodeId));
    
    try {
      const members = await fetchChildren(nodeId);
      const children = members.map(member => ({
        id: member.referral_code,
        name: `${(member.first_name ?? 'N/A')} ${member.last_name ?? ''} [${member.status ?? 'pending'}]`,
        data: { fullData: { ...member, profile_image: member.img_url || '' } },
        children: [],
        depth: currentDepth + 1,
        canExpand: currentDepth + 1 < maxDepth
      }));

      setTreeData(prev => {
        const updateNode = (node) => {
          if (node.id === nodeId) {
            return { ...node, children };
          }
          if (node.children) {
            return {
              ...node,
              children: node.children.map(updateNode)
            };
          }
          return node;
        };
        return updateNode(prev);
      });
      
      setExpandedNodes(prev => new Set(prev).add(nodeId));
    } catch (err) {
      console.error('Failed to load children:', err);
    } finally {
      setLoadingNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
    }
  }, [fetchChildren, expandedNodes, maxDepth]);

  // Info button click shows tooltip (separate from node click/expand)
  const onInfoClick = useCallback((nodeId, fullData) => {
    // Close tooltip if clicking same node
    if (tooltip.show && tooltip.nodeId === nodeId) {
      setTooltip({ show: false, position: {}, data: null, nodeId: null });
      return;
    }
    
    // Show tooltip
    if (fullData && containerRef.current) {
      const nodeElement = document.getElementById(`node-${nodeId}`);
      if (nodeElement && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const nodeRect = nodeElement.getBoundingClientRect();
        
        setTooltip({
          show: true,
          position: {
            x: nodeRect.right + tooltipOffsetX - rect.left,
            y: nodeRect.top + tooltipOffsetY - rect.top,
          },
          data: fullData,
          nodeId: nodeId
        });
      }
    }
  }, [tooltip.show, tooltip.nodeId]);

  const closeTooltip = useCallback(() => {
    setTooltip({ show: false, position: {}, data: null, nodeId: null });
  }, []);

  // Click on node expands/collapses children (without showing tooltip)
  const onNodeClick = useCallback((_, node) => {
    loadChildren(node.id, node.depth || 1);
  }, [loadChildren]);

  const { nodes, edges } = useMemo(() => {
    const graph = convertTreeToGraph(treeData);
    return getLayoutedElements(graph.nodes, graph.edges);
  }, [treeData]);

  // Custom node types object - pass onInfoClick handler
  const nodeTypes = useMemo(() => ({
    [CUSTOM_NODE_TYPE]: (nodeData) => (
      <ProfileNode 
        data={nodeData.data} 
        onInfoClick={onInfoClick}
      />
    ),
  }), [onInfoClick]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: 'relative' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      {tooltip.show && tooltip.data && (
        <TooltipModal 
          data={tooltip.data}
          onClose={closeTooltip}
        />
      )}
    </div>
  );
}
